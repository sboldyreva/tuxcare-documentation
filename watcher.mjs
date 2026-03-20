#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';

const NEXUS_BASE = 'https://nexus.repo.tuxcare.com';
const NEXUS_USER = process.env.NEXUS_USER;
const NEXUS_PASSWORD = process.env.NEXUS_PASSWORD;

const REPOS = [
  { name: 'els-js',       ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els_angular',  ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els-vue',      ecosystem: 'JavaScript', format: 'npm' },
  { name: 'els_java',     ecosystem: 'Java',       format: 'maven2' },
  { name: 'els_spring',   ecosystem: 'Java',       format: 'maven2' },
  { name: 'els_tomcat',   ecosystem: 'Java',       format: 'maven2' },
  { name: 'els-python-whl', ecosystem: 'Python',   format: 'pypi' },
  { name: 'els_php',      ecosystem: 'PHP',        format: 'raw' },
  { name: 'els_dotnet',   ecosystem: '.NET',       format: 'nuget' },
];

const STATE_FILE = '/tmp/els-watcher-state.json';
const LAST_CHECK_DEFAULT = '2026-03-16T11:00:00.000Z';

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');

function loadState() {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, 'utf-8'));
  }
  return null;
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function nexusFetch(url) {
  const auth = Buffer.from(`${NEXUS_USER}:${NEXUS_PASSWORD}`).toString('base64');
  const resp = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(30000),
  });
  if (!resp.ok) throw new Error(`Nexus ${resp.status}: ${url}`);
  return resp.json();
}

async function listAssets(repoName, maxPages = 100) {
  const all = [];
  let token = null;
  let page = 0;
  do {
    const url = `${NEXUS_BASE}/service/rest/v1/assets?repository=${repoName}` +
      (token ? `&continuationToken=${token}` : '');
    const data = await nexusFetch(url);
    if (data.items) all.push(...data.items);
    token = data.continuationToken || null;
    page++;
    if (page >= maxPages) {
      console.error(`[WARN] Repo ${repoName}: hit ${maxPages} page limit with ${all.length} assets`);
      break;
    }
  } while (token);
  return all;
}

async function searchComponents(repoName, maxPages = 50) {
  const all = [];
  let token = null;
  let page = 0;
  do {
    const url = `${NEXUS_BASE}/service/rest/v1/search?repository=${repoName}` +
      (token ? `&continuationToken=${token}` : '');
    const data = await nexusFetch(url);
    if (data.items) all.push(...data.items);
    token = data.continuationToken || null;
    page++;
    if (page >= maxPages) {
      console.error(`[WARN] Repo ${repoName}: hit ${maxPages} page limit with ${all.length} components`);
      break;
    }
  } while (token);
  return all;
}

function assetKey(a) {
  return `${a.repository}|${a.path}`;
}

function extractComponentInfo(asset, repoConfig) {
  const path = asset.path || '';
  const name = asset.npm?.name || asset.pypi?.name || asset.nuget?.id || extractNameFromPath(path, repoConfig);
  const version = asset.npm?.version || asset.pypi?.version || asset.nuget?.version || extractVersionFromPath(path);
  return {
    repository: asset.repository || repoConfig.name,
    name: name || path.split('/').filter(Boolean).pop() || path,
    version: version || 'unknown',
    path,
    ecosystem: repoConfig.ecosystem,
    format: repoConfig.format,
    lastModified: asset.lastModified || asset.blobCreated,
    uploader: asset.uploadedBy || asset.createdBy || 'unknown',
  };
}

function extractNameFromPath(path, repoConfig) {
  if (repoConfig.format === 'maven2') {
    const parts = path.replace(/^\//, '').split('/');
    if (parts.length >= 3) {
      return parts[parts.length - 3];
    }
  }
  if (repoConfig.format === 'npm') {
    const match = path.match(/([^/]+)-[\d]+\..+\.tgz$/);
    if (match) return match[1];
    const parts = path.replace(/^\//, '').split('/');
    if (parts.length >= 2 && parts[0].startsWith('@')) return `${parts[0]}/${parts[1]}`;
    if (parts.length >= 1) return parts[0];
  }
  return path.split('/').filter(Boolean).pop() || path;
}

function extractVersionFromPath(path) {
  const match = path.match(/[\/-]([\d]+\.[\d]+\.[\d]+[^/]*?)(?:\.(jar|pom|tgz|whl|tar\.gz|nupkg|zip))?$/);
  if (match) return match[1];
  return 'unknown';
}

function deduplicateToComponents(assets, repoConfig) {
  const componentMap = new Map();
  for (const asset of assets) {
    const info = extractComponentInfo(asset, repoConfig);
    const key = `${info.name}|${info.version}`;
    if (!componentMap.has(key)) {
      componentMap.set(key, info);
    } else {
      const existing = componentMap.get(key);
      if (new Date(info.lastModified) > new Date(existing.lastModified)) {
        componentMap.set(key, info);
      }
    }
  }
  return [...componentMap.values()];
}

async function main() {
  const prevState = loadState();
  const isFirstRun = !prevState;
  const lastCheck = prevState?.lastRun || LAST_CHECK_DEFAULT;
  const lastCheckDate = new Date(lastCheck);

  const now = new Date().toISOString();
  const newReleases = [];
  const errors = [];
  const allComponentKeys = {};

  console.error(`[INFO] Scanning Nexus repos. Last check: ${lastCheck}`);

  for (const repo of REPOS) {
    try {
      console.error(`[INFO] Scanning repo: ${repo.name}...`);
      const assets = await listAssets(repo.name, 150);
      console.error(`[INFO]   ${repo.name}: ${assets.length} assets found`);

      const components = deduplicateToComponents(assets, repo);

      for (const comp of components) {
        const key = `${comp.repository}|${comp.name}|${comp.version}`;
        allComponentKeys[key] = true;

        if (!isFirstRun) {
          const modDate = new Date(comp.lastModified);
          if (modDate > lastCheckDate) {
            const prevKeys = prevState.componentKeys || {};
            if (!prevKeys[key]) {
              newReleases.push(comp);
            }
          }
        }
      }
    } catch (err) {
      console.error(`[ERROR] Repo ${repo.name}: ${err.message}`);
      errors.push({ repo: repo.name, error: err.message });
    }
  }

  const newState = { lastRun: now, componentKeys: allComponentKeys };
  saveState(newState);

  const output = {
    timestamp: now,
    isFirstRun,
    lastCheck,
    totalScanned: Object.keys(allComponentKeys).length,
    newReleases,
    errors,
  };

  if (jsonMode) {
    console.log(JSON.stringify(output, null, 2));
  } else {
    if (isFirstRun) {
      console.log(`First run baseline: ${output.totalScanned} components across ${REPOS.length} repos`);
    } else if (newReleases.length === 0) {
      console.log('No new ELS releases since last check.');
    } else {
      console.log(`Found ${newReleases.length} new releases`);
      for (const r of newReleases) {
        console.log(`  [${r.ecosystem}] ${r.name}@${r.version} (${r.repository})`);
      }
    }
  }
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message, stack: err.stack }));
  process.exit(1);
});
