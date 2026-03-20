#!/usr/bin/env node

const NEXUS_BASE = 'https://nexus.repo.tuxcare.com';
const NEXUS_USER = process.env.NEXUS_USER;
const NEXUS_PASSWORD = process.env.NEXUS_PASSWORD;

const SINCE = new Date('2026-03-16T11:00:00.000Z');

const REPOS = [
  { name: 'els_js',       ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els_angular',  ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els-vue',      ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els_vue',      ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els_java',     ecosystem: 'Java',       format: 'maven2' },
  { name: 'els_spring',   ecosystem: 'Java',       format: 'maven2' },
  { name: 'els_tomcat',   ecosystem: 'Java',       format: 'maven2' },
  { name: 'els-python-whl', ecosystem: 'Python',   format: 'pypi' },
  { name: 'els-python-source', ecosystem: 'Python', format: 'pypi' },
  { name: 'els_php',      ecosystem: 'PHP',        format: 'raw' },
  { name: 'els_dotnet',   ecosystem: '.NET',       format: 'nuget' },
];

async function nexusFetch(url) {
  const auth = Buffer.from(`${NEXUS_USER}:${NEXUS_PASSWORD}`).toString('base64');
  const resp = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(30000),
  });
  if (!resp.ok) {
    console.error(`  [WARN] ${resp.status} for ${url}`);
    return null;
  }
  return resp.json();
}

async function scanRepoForRecent(repo) {
  const recent = [];
  let token = null;
  let page = 0;
  const maxPages = 200;
  do {
    const url = `${NEXUS_BASE}/service/rest/v1/assets?repository=${repo.name}` +
      (token ? `&continuationToken=${token}` : '');
    const data = await nexusFetch(url);
    if (!data) break;
    
    let foundOlderThanCutoff = false;
    for (const asset of (data.items || [])) {
      const lastMod = new Date(asset.lastModified || asset.blobCreated);
      if (lastMod >= SINCE) {
        recent.push({
          path: asset.path,
          repository: asset.repository || repo.name,
          lastModified: asset.lastModified || asset.blobCreated,
          format: asset.format || repo.format,
          contentType: asset.contentType,
          uploader: asset.uploadedBy || asset.createdBy || 'unknown',
        });
      }
    }
    
    token = data.continuationToken || null;
    page++;
    if (page >= maxPages) break;
  } while (token);
  
  return recent;
}

function parseAssetToComponent(asset, repoConfig) {
  const path = asset.path || '';
  let name = '', version = '', group = '';
  
  if (repoConfig.format === 'npm') {
    const tgzMatch = path.match(/^(?:@([^/]+)\/)?([^/]+)\/-\/[^/]+-(\d+\..+)\.tgz$/);
    if (tgzMatch) {
      name = tgzMatch[1] ? `@${tgzMatch[1]}/${tgzMatch[2]}` : tgzMatch[2];
      version = tgzMatch[3];
    } else {
      const parts = path.replace(/^\//, '').split('/');
      name = parts[0];
      version = path;
    }
  } else if (repoConfig.format === 'maven2') {
    const parts = path.replace(/^\//, '').split('/');
    if (parts.length >= 3) {
      version = parts[parts.length - 2];
      name = parts[parts.length - 3];
      group = parts.slice(0, parts.length - 3).join('.');
    }
  } else if (repoConfig.format === 'pypi') {
    const whlMatch = path.match(/([a-zA-Z0-9_]+)-(\d+\.\d+[^-]*)/);
    if (whlMatch) {
      name = whlMatch[1].replace(/_/g, '-');
      version = whlMatch[2];
    } else {
      name = path;
      version = 'unknown';
    }
  } else if (repoConfig.format === 'nuget' || repoConfig.format === 'raw') {
    const match = path.match(/([^/]+?)[\/-](\d+\.\d+[^/]*?)(?:\.(nupkg|json|zip))?$/);
    if (match) {
      name = match[1];
      version = match[2];
    } else {
      name = path.split('/').filter(Boolean).pop() || path;
      version = 'unknown';
    }
  }
  
  return {
    name,
    version,
    group,
    path,
    repository: asset.repository,
    ecosystem: repoConfig.ecosystem,
    format: repoConfig.format,
    lastModified: asset.lastModified,
    uploader: asset.uploader,
  };
}

function isRelevantAsset(asset) {
  const path = asset.path || '';
  if (path.endsWith('.pom') || path.endsWith('.md5') || path.endsWith('.sha1') || 
      path.endsWith('.sha256') || path.endsWith('.sha512') || path.endsWith('.xml') ||
      path.endsWith('.module') || path.endsWith('.asc') ||
      path.includes('maven-metadata') || path.endsWith('/')) return false;
  return true;
}

async function main() {
  console.error(`Scanning for new releases since ${SINCE.toISOString()}`);
  
  const allRecent = [];
  const errors = [];
  
  for (const repo of REPOS) {
    console.error(`Scanning ${repo.name}...`);
    try {
      const recent = await scanRepoForRecent(repo);
      console.error(`  ${repo.name}: ${recent.length} recent assets`);
      
      const relevant = recent.filter(isRelevantAsset);
      const components = relevant.map(a => parseAssetToComponent(a, repo));
      
      const uniqueMap = new Map();
      for (const c of components) {
        const key = `${c.name}|${c.version}`;
        if (!uniqueMap.has(key) || new Date(c.lastModified) > new Date(uniqueMap.get(key).lastModified)) {
          uniqueMap.set(key, c);
        }
      }
      
      allRecent.push(...uniqueMap.values());
    } catch (err) {
      console.error(`  ERROR ${repo.name}: ${err.message}`);
      errors.push({ repo: repo.name, error: err.message });
    }
  }
  
  const byEcosystem = {};
  for (const r of allRecent) {
    if (!byEcosystem[r.ecosystem]) byEcosystem[r.ecosystem] = [];
    byEcosystem[r.ecosystem].push(r);
  }
  
  const output = {
    timestamp: new Date().toISOString(),
    isFirstRun: false,
    since: SINCE.toISOString(),
    newReleases: allRecent,
    byEcosystem,
    errors,
  };
  
  console.log(JSON.stringify(output, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
