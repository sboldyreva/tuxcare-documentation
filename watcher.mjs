#!/usr/bin/env node

/**
 * ELS Release Watcher — optimized with early exit for repos with no recent changes.
 * Usage: node watcher.mjs --json [--jira] [--since ISO_DATE]
 */

const NEXUS_URL = 'https://nexus.repo.tuxcare.com';
const NEXUS_USER = process.env.NEXUS_USER;
const NEXUS_PASSWORD = process.env.NEXUS_PASSWORD;
const JIRA_DOMAIN = process.env.JIRA_DOMAIN;
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const createJira = args.includes('--jira');
const sinceIdx = args.indexOf('--since');
const sinceDate = sinceIdx >= 0 ? args[sinceIdx + 1] : null;

const REPOS = [
  { repo: 'els_js', ecosystem: 'javascript', format: 'npm' },
  { repo: 'els_angular', ecosystem: 'javascript', format: 'npm' },
  { repo: 'els_vue', ecosystem: 'javascript', format: 'npm' },
  { repo: 'els_python', ecosystem: 'python', format: 'pypi' },
  { repo: 'els_php', ecosystem: 'php', format: 'composer' },
  { repo: 'els_dotnet', ecosystem: 'dotnet', format: 'nuget' },
  { repo: 'els_java', ecosystem: 'java', format: 'maven2' },
  { repo: 'els_spring', ecosystem: 'java', format: 'maven2' },
  { repo: 'els_tomcat', ecosystem: 'java', format: 'maven2' },
];

const KNOWN_PROCESSED = new Set([
  'lodash.merge@3.3.2-tuxcare.1', 'lodash.merge@3.3.2-tuxcare.2',
  'websocket-extensions@0.1.1-tuxcare.1', 'websocket-extensions@0.1.1-tuxcare.2', 'websocket-extensions@0.1.1-tuxcare.3',
  'xmlhttprequest-ssl@1.5.3-tuxcare.1',
  'extend@3.0.0-tuxcare.1', 'extend@3.0.0-tuxcare.2', 'extend@3.0.0-tuxcare.3',
  'fstream@1.0.8-tuxcare.1', 'fstream@1.0.8-tuxcare.2', 'fstream@1.0.8-tuxcare.3',
  'qs@2.4.2-tuxcare.1', 'qs@2.4.2-tuxcare.2', 'qs@6.5.3-tuxcare.1',
  'marked@0.2.10-tuxcare.1', 'tar@2.2.2-tuxcare.1',
  'lodash@3.10.1-tuxcare.1', 'lodash@3.10.1-tuxcare.2',
  'validator@10.11.0-tuxcare.2', 'validator@8.2.0-tuxcare.2',
  'form-data@1.0.0-rc3-tuxcare.1', 'diff@1.4.0-tuxcare.1',
  'aiohttp@3.8.1.post6+tuxcare',
  'framework@5.4.36-p2+tuxcare', 'framework@5.5.50-p1+tuxcare',
  'framework@5.6.40-p1+tuxcare', 'framework@5.7.29-p1+tuxcare',
  'dompdf@3.1.0-p0+tuxcare',
  'Newtonsoft.Json@6.0.8.1-tuxcare.1',
  'async@2.6.1-tuxcare.2',
  'debug@2.1.1-tuxcare.2', 'debug@2.1.1-tuxcare.3', 'debug@2.3.3-tuxcare.2',
  'form-data@0.2.0-tuxcare.1', 'handlebars@3.0.3-tuxcare.1',
  'highlight.js@9.18.5-tuxcare.1', 'jquery-validation@1.19.0-tuxcare.2',
  'minimist@1.2.8-tuxcare.1', 'moment@2.10.6-tuxcare.1', 'mout@0.9.1-tuxcare.1',
  'parsejson@0.0.3-tuxcare.1', 'qs@5.1.0-tuxcare.1', 'qs@5.2.0-tuxcare.1',
  'tough-cookie@2.2.0-tuxcare.1', 'aiohttp@3.8.1.post5+tuxcare',
]);

async function nexusFetch(url) {
  const auth = Buffer.from(`${NEXUS_USER}:${NEXUS_PASSWORD}`).toString('base64');
  const resp = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}`, 'Accept': 'application/json' },
    signal: AbortSignal.timeout(30000),
  });
  if (!resp.ok) throw new Error(`Nexus API error: ${resp.status} for ${url}`);
  return resp.json();
}

async function scanRepoForNewReleases(repoName, sinceMs) {
  const newItems = [];
  let continuationToken = null;
  let page = 0;
  let consecutiveEmptyPages = 0;

  do {
    let url = `${NEXUS_URL}/service/rest/v1/search?repository=${repoName}`;
    if (continuationToken) url += `&continuationToken=${continuationToken}`;
    
    const data = await nexusFetch(url);
    const items = data.items || [];
    let foundOnPage = 0;
    
    for (const item of items) {
      const lm = item.assets?.[0]?.lastModified;
      if (lm) {
        const lmMs = new Date(lm).getTime();
        if (lmMs >= sinceMs) {
          newItems.push(item);
          foundOnPage++;
        }
      }
    }
    
    if (foundOnPage === 0) {
      consecutiveEmptyPages++;
    } else {
      consecutiveEmptyPages = 0;
    }
    
    // Early exit: if 5 consecutive pages have no new items, stop scanning
    // (pages are ~50 items each, so this means 250 items without a match)
    if (consecutiveEmptyPages >= 5) {
      console.error(`    Early exit after ${page + 1} pages (5 consecutive empty pages)`);
      break;
    }
    
    continuationToken = data.continuationToken || null;
    page++;
    if (page > 300) break;
  } while (continuationToken);
  
  console.error(`    Scanned ${page} pages, found ${newItems.length} new items`);
  return newItems;
}

async function jiraFetch(path, options = {}) {
  const url = `https://${JIRA_DOMAIN}/rest/api/3${path}`;
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');
  const resp = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Jira API error: ${resp.status}: ${body}`);
  }
  if (resp.status === 204) return null;
  return resp.json();
}

async function findExistingJiraTask(ecosystem) {
  const ecosystemLabel = ecosystem.charAt(0).toUpperCase() + ecosystem.slice(1);
  const jql = `project = ELSDOC AND summary ~ "ELS ${ecosystemLabel} docs" AND status != Done ORDER BY created DESC`;
  try {
    const result = await jiraFetch('/search/jql', {
      method: 'POST',
      body: JSON.stringify({ jql, maxResults: 5 }),
    });
    if (result.issues?.length > 0) return result.issues[0];
  } catch (e) {
    console.error(`Jira search warning: ${e.message}`);
  }
  return null;
}

async function createJiraTask(ecosystem, releases) {
  const ecosystemLabel = ecosystem.charAt(0).toUpperCase() + ecosystem.slice(1);
  const packageNames = [...new Set(releases.map(r => r.name))].slice(0, 10).join(', ');
  const summary = `Update ELS ${ecosystemLabel} docs — ${packageNames}`;
  const description = {
    type: 'doc', version: 1,
    content: [{ type: 'paragraph', content: [{
      type: 'text',
      text: `New ELS releases detected for ${ecosystemLabel} ecosystem:\n${releases.map(r => `• ${r.stateKey}`).join('\n')}`
    }]}]
  };

  const existing = await findExistingJiraTask(ecosystem);
  if (existing) {
    console.error(`  Found existing Jira task: ${existing.key}`);
    return existing.key;
  }

  const result = await jiraFetch('/issue', {
    method: 'POST',
    body: JSON.stringify({
      fields: {
        project: { key: 'ELSDOC' },
        summary,
        description,
        issuetype: { name: 'Task' },
      }
    }),
  });
  return result.key;
}

async function main() {
  console.error('ELS Release Watcher starting...');
  
  const lastRunDate = sinceDate || '2026-03-12T10:02:20Z';
  const sinceMs = new Date(lastRunDate).getTime();
  
  console.error(`Scanning for releases modified since: ${lastRunDate}`);

  const newReleases = [];
  const ecosystemMap = {};

  for (const { repo, ecosystem, format } of REPOS) {
    console.error(`Scanning ${repo} (${ecosystem})...`);
    try {
      const components = await scanRepoForNewReleases(repo, sinceMs);
      
      for (const comp of components) {
        const stateKey = `${comp.name}@${comp.version}`;
        if (KNOWN_PROCESSED.has(stateKey)) {
          console.error(`    Skipping already processed: ${stateKey}`);
          continue;
        }
        const compInfo = {
          stateKey,
          name: comp.name,
          version: comp.version,
          ecosystem,
          repo,
          format,
          group: comp.group || null,
          lastModified: comp.assets?.[0]?.lastModified || null,
          downloadUrl: comp.assets?.[0]?.downloadUrl || null,
        };
        newReleases.push(compInfo);
        if (!ecosystemMap[ecosystem]) ecosystemMap[ecosystem] = [];
        ecosystemMap[ecosystem].push(compInfo);
      }
    } catch (e) {
      console.error(`  Error scanning ${repo}: ${e.message}`);
    }
  }

  console.error(`\nTotal new releases found: ${newReleases.length}`);

  const jiraTasks = {};
  if (createJira && newReleases.length > 0) {
    for (const [eco, releases] of Object.entries(ecosystemMap)) {
      console.error(`Creating Jira task for ${eco} (${releases.length} releases)...`);
      try {
        const key = await createJiraTask(eco, releases);
        if (key) {
          jiraTasks[eco] = key;
          console.error(`  Created/found: ${key}`);
        }
      } catch (e) {
        console.error(`  Error creating Jira task: ${e.message}`);
      }
    }
  }

  const output = {
    isFirstRun: false,
    sinceDate: lastRunDate,
    newReleases: newReleases.map(r => ({
      stateKey: r.stateKey,
      name: r.name,
      version: r.version,
      ecosystem: r.ecosystem,
      repo: r.repo,
      group: r.group,
      lastModified: r.lastModified,
      downloadUrl: r.downloadUrl,
    })),
    ecosystemSummary: Object.fromEntries(
      Object.entries(ecosystemMap).map(([eco, releases]) => [
        eco,
        { count: releases.length, jiraKey: jiraTasks[eco] || null, packages: releases.map(r => r.stateKey) }
      ])
    ),
    jiraTasks,
  };

  if (jsonMode) {
    console.log(JSON.stringify(output, null, 2));
  }
}

main().catch(e => {
  console.error(`Fatal error: ${e.message}`);
  process.exit(1);
});
