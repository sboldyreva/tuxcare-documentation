#!/usr/bin/env python3
"""
ELS Release Enrichment Pipeline
Fetches VEX data, NVD CVE info, and prepares Jira task descriptions.
"""
import json, os, sys, urllib.request, base64, re, time
from datetime import datetime

NEXUS_BASE = "https://nexus.repo.tuxcare.com"
NEXUS_USER = os.environ.get("NEXUS_USER", "")
NEXUS_PASSWORD = os.environ.get("NEXUS_PASSWORD", "")
VEX_BASE = "https://security.tuxcare.com/vex/cyclonedx"
NVD_API = "https://services.nvd.nist.gov/rest/json/cves/2.0"

def nexus_auth():
    return base64.b64encode(f"{NEXUS_USER}:{NEXUS_PASSWORD}".encode()).decode()

def http_get(url, headers=None, timeout=30):
    hdrs = headers or {}
    req = urllib.request.Request(url, headers=hdrs)
    try:
        resp = urllib.request.urlopen(req, timeout=timeout)
        return json.loads(resp.read())
    except Exception as e:
        return None

def nexus_search_component(repo, name, version=None):
    url = f"{NEXUS_BASE}/service/rest/v1/search?repository={repo}&name={name}"
    if version:
        url += f"&version={version}"
    data = http_get(url, {"Authorization": f"Basic {nexus_auth()}"})
    if data and data.get("items"):
        return True, data["items"]
    return False, []

def nexus_verify(package_name, version, repo):
    found, items = nexus_search_component(repo, package_name, version)
    return found

def fetch_vex(ecosystem, package_name=None):
    eco_map = {
        "JavaScript": "els_lang_javascript",
        "Java": "els_lang_java",
        "Python": "els_lang_python",
        "PHP": "els_lang_php",
        ".NET": "els_lang_dotnet",
    }
    eco_key = eco_map.get(ecosystem)
    if not eco_key:
        return None
    
    url = f"{VEX_BASE}/{eco_key}/vex.json"
    data = http_get(url, timeout=15)
    if data:
        return data
    
    if package_name:
        url2 = f"{VEX_BASE}/{eco_key}/{package_name}/vex.json"
        data2 = http_get(url2, timeout=15)
        if data2:
            return data2
    
    return None

def extract_cves_from_vex(vex_data, package_name=None):
    cves = []
    if not vex_data:
        return cves
    
    vulnerabilities = vex_data.get("vulnerabilities", [])
    for vuln in vulnerabilities:
        cve_id = vuln.get("id", "")
        if not cve_id.startswith("CVE-"):
            continue
        
        affects = vuln.get("affects", [])
        if package_name:
            relevant = False
            for affect in affects:
                ref = affect.get("ref", "")
                if package_name.lower() in ref.lower():
                    relevant = True
                    break
            if not relevant:
                continue
        
        analysis = vuln.get("analysis", {})
        state = analysis.get("state", "")
        
        cves.append({
            "cve_id": cve_id,
            "state": state,
            "description": vuln.get("description", ""),
        })
    
    return cves

def query_nvd(cve_id, retries=3):
    url = f"{NVD_API}?cveId={cve_id}"
    for attempt in range(retries):
        data = http_get(url, timeout=30)
        if data:
            return data
        time.sleep(2 * (attempt + 1))
    return None

def extract_nvd_severity(nvd_data):
    if not nvd_data:
        return "Unknown"
    
    vulns = nvd_data.get("vulnerabilities", [])
    if not vulns:
        return "Unknown"
    
    cve_item = vulns[0].get("cve", {})
    metrics = cve_item.get("metrics", {})
    
    for key in ["cvssMetricV31", "cvssMetricV30", "cvssMetricV2"]:
        if key in metrics:
            for m in metrics[key]:
                cvss = m.get("cvssData", {})
                severity = cvss.get("baseSeverity", "")
                if severity:
                    return severity.capitalize()
    
    return "Unknown"

def extract_nvd_vulnerable_ranges(nvd_data, package_name=None):
    if not nvd_data:
        return "Unknown"
    
    vulns = nvd_data.get("vulnerabilities", [])
    if not vulns:
        return "Unknown"
    
    cve_item = vulns[0].get("cve", {})
    configs = cve_item.get("configurations", [])
    
    ranges = []
    for config in configs:
        for node in config.get("nodes", []):
            for cpe_match in node.get("cpeMatch", []):
                if not cpe_match.get("vulnerable", False):
                    continue
                
                criteria = cpe_match.get("criteria", "")
                
                start_inc = cpe_match.get("versionStartIncluding", "")
                start_exc = cpe_match.get("versionStartExcluding", "")
                end_inc = cpe_match.get("versionEndIncluding", "")
                end_exc = cpe_match.get("versionEndExcluding", "")
                
                parts = []
                if start_inc:
                    parts.append(f">= {start_inc}")
                elif start_exc:
                    parts.append(f"> {start_exc}")
                
                if end_exc:
                    parts.append(f"< {end_exc}")
                elif end_inc:
                    parts.append(f"<= {end_inc}")
                
                if parts:
                    ranges.append(", ".join(parts))
                elif criteria:
                    cpe_parts = criteria.split(":")
                    if len(cpe_parts) >= 6 and cpe_parts[5] != "*":
                        ranges.append(f"= {cpe_parts[5]}")
    
    if ranges:
        return " | ".join(sorted(set(ranges)))
    return "Unknown"

def query_mitre_severity(cve_id):
    url = f"https://cveawg.mitre.org/api/cve/{cve_id}"
    data = http_get(url, timeout=15)
    if data:
        containers = data.get("containers", {})
        cna = containers.get("cna", {})
        metrics = cna.get("metrics", [])
        for m in metrics:
            cvss = m.get("cvssV3_1", m.get("cvssV3_0", {}))
            severity = cvss.get("baseSeverity", "")
            if severity:
                return severity.capitalize()
    return None


def main():
    releases_by_ecosystem = {
        "JavaScript": [
            {"name": "angular (15 modules)", "version": "15.2.10-tuxcare.6", "repo": "els_js", "uploaded": "2026-03-18", "modules": [
                "angular-animations", "angular-bazel", "angular-common", "angular-compiler",
                "angular-compiler-cli", "angular-core", "angular-elements", "angular-forms",
                "angular-language-service", "angular-localize", "angular-platform-browser",
                "angular-platform-browser-dynamic", "angular-platform-server", "angular-router",
                "angular-service-worker", "angular-upgrade"
            ], "search_name": "angular-core"},
            {"name": "vite", "version": "5.4.14-tuxcare.2", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "vite"},
            {"name": "next", "version": "14.2.35-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "next"},
            {"name": "jspdf", "version": "3.0.4-tuxcare.6", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "jspdf"},
            {"name": "jspdf", "version": "2.5.2-tuxcare.8", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "jspdf"},
            {"name": "mysql2", "version": "2.3.3-tuxcare.3", "repo": "els_js", "uploaded": "2026-03-19", "search_name": "mysql2"},
            {"name": "mysql", "version": "2.18.1-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-19", "search_name": "mysql"},
            {"name": "nuxt", "version": "2.18.1-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "nuxt"},
            {"name": "rollup", "version": "0.41.6-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-19", "search_name": "rollup"},
            {"name": "body-parser", "version": "1.8.4-tuxcare.2", "repo": "els_js", "uploaded": "2026-03-19", "search_name": "body-parser"},
            {"name": "tar", "version": "1.0.3-tuxcare.2", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "tar"},
            {"name": "debug", "version": "2.1.1-tuxcare.4", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "debug"},
            {"name": "markdown-it", "version": "4.3.0-tuxcare.2", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "markdown-it"},
            {"name": "markdown-it", "version": "4.0.3-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "markdown-it"},
            {"name": "morgan", "version": "1.5.3-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "morgan"},
            {"name": "mout", "version": "0.11.0-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-16", "search_name": "mout"},
            {"name": "clean-css", "version": "2.2.23-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "clean-css"},
            {"name": "json5", "version": "0.5.1-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "json5"},
            {"name": "jsonpointer", "version": "1.1.0-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "jsonpointer"},
            {"name": "got", "version": "2.9.2-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "got"},
            {"name": "fresh", "version": "0.2.4-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "fresh"},
            {"name": "forwarded", "version": "0.1.0-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "forwarded"},
            {"name": "chownr", "version": "0.0.2-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "chownr"},
            {"name": "es5-ext", "version": "0.10.7-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "es5-ext"},
            {"name": "cross-spawn", "version": "0.2.9-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "cross-spawn"},
            {"name": "semver", "version": "2.3.2-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "semver"},
            {"name": "concat-stream", "version": "1.4.8-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "concat-stream"},
            {"name": "is-my-json-valid", "version": "2.10.1-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "is-my-json-valid"},
            {"name": "terser", "version": "3.17.0-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-18", "search_name": "terser"},
            {"name": "requirejs", "version": "2.1.22-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-17", "search_name": "requirejs"},
            {"name": "js-yaml", "version": "3.3.1-tuxcare.1", "repo": "els_js", "uploaded": "2026-03-20", "search_name": "js-yaml"},
        ],
        "Java": [
            {"name": "Apache Tomcat (40 modules)", "version": "10.1.42-tuxcare.1", "repo": "els_tomcat", "uploaded": "2026-03-17", "search_name": "tomcat-catalina", "group": "org.apache.tomcat"},
        ],
        "Python": [
            {"name": "cryptography", "version": "45.0.7.post1+tuxcare", "repo": "els-python-whl", "uploaded": "2026-03-19", "search_name": "cryptography"},
            {"name": "cryptography", "version": "42.0.8.post2+tuxcare", "repo": "els-python-whl", "uploaded": "2026-03-19", "search_name": "cryptography"},
        ],
        ".NET": [
            {"name": "NHibernate", "version": "4.1.2.4001-tuxcare.1", "repo": "els_dotnet", "uploaded": "2026-03-17", "search_name": "NHibernate"},
        ],
    }
    
    enriched = {}
    
    for ecosystem, releases in releases_by_ecosystem.items():
        print(f"\n{'='*60}", file=sys.stderr)
        print(f"Processing {ecosystem} ({len(releases)} packages)", file=sys.stderr)
        print(f"{'='*60}", file=sys.stderr)
        
        eco_data = {
            "ecosystem": ecosystem,
            "releases": [],
            "nexus_verified": [],
            "vex_status": {"available": [], "pending": []},
            "cves": [],
            "errors": [],
        }
        
        # 1. Nexus verification
        for rel in releases:
            name = rel.get("search_name", rel["name"])
            version = rel["version"]
            repo = rel["repo"]
            
            print(f"  Verifying {name}@{version} in {repo}...", file=sys.stderr)
            try:
                found = nexus_verify(name, version, repo)
                eco_data["nexus_verified"].append({
                    "package": rel["name"],
                    "version": version,
                    "repository": repo,
                    "found": found,
                })
                rel["nexus_found"] = found
                print(f"    -> {'Found' if found else 'NOT FOUND'}", file=sys.stderr)
            except Exception as e:
                print(f"    -> Error: {e}", file=sys.stderr)
                rel["nexus_found"] = False
                eco_data["errors"].append(f"Nexus verification failed for {name}@{version}: {e}")
            
            eco_data["releases"].append(rel)
        
        # 2. VEX check
        print(f"  Fetching VEX for {ecosystem}...", file=sys.stderr)
        vex_data = fetch_vex(ecosystem)
        
        if vex_data:
            print(f"    -> VEX data available", file=sys.stderr)
            for rel in releases:
                name = rel.get("search_name", rel["name"])
                cves = extract_cves_from_vex(vex_data, name)
                if cves:
                    eco_data["vex_status"]["available"].append(f"{rel['name']} {rel['version']}")
                    for cve in cves:
                        eco_data["cves"].append({
                            "package": rel["name"],
                            "cve_id": cve["cve_id"],
                            "state": cve["state"],
                            "fixed_in": rel["version"],
                        })
                else:
                    eco_data["vex_status"]["pending"].append(f"{rel['name']} {rel['version']}")
        else:
            print(f"    -> VEX data NOT available", file=sys.stderr)
            for rel in releases:
                eco_data["vex_status"]["pending"].append(f"{rel['name']} {rel['version']}")
        
        # 3. NVD enrichment for each CVE
        cve_enriched = []
        unique_cves = {}
        for cve_entry in eco_data["cves"]:
            cve_id = cve_entry["cve_id"]
            if cve_id in unique_cves:
                cve_enriched.append({
                    **cve_entry,
                    **unique_cves[cve_id],
                })
                continue
            
            print(f"  Querying NVD for {cve_id}...", file=sys.stderr)
            time.sleep(0.6)  # NVD rate limit
            nvd_data = query_nvd(cve_id)
            
            severity = extract_nvd_severity(nvd_data)
            vuln_range = extract_nvd_vulnerable_ranges(nvd_data)
            
            if severity == "Unknown":
                print(f"    -> NVD severity unknown, trying MITRE...", file=sys.stderr)
                mitre_sev = query_mitre_severity(cve_id)
                if mitre_sev:
                    severity = mitre_sev
            
            nvd_info = {
                "severity": severity,
                "vulnerable_versions": vuln_range,
            }
            unique_cves[cve_id] = nvd_info
            
            cve_enriched.append({
                **cve_entry,
                **nvd_info,
            })
            print(f"    -> Severity: {severity}, Range: {vuln_range}", file=sys.stderr)
        
        eco_data["cves"] = cve_enriched
        enriched[ecosystem] = eco_data
    
    # Output
    print(json.dumps(enriched, indent=2))


if __name__ == "__main__":
    main()
