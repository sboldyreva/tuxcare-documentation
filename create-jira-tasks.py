#!/usr/bin/env python3
"""
Create/update Jira tasks per ecosystem with enriched descriptions.
"""
import json, os, sys, urllib.request, urllib.parse, base64

JIRA_DOMAIN = os.environ.get("JIRA_DOMAIN", "")
JIRA_EMAIL = os.environ.get("JIRA_EMAIL", "")
JIRA_API_TOKEN = os.environ.get("JIRA_API_TOKEN", "")

if not JIRA_DOMAIN.endswith(".atlassian.net"):
    JIRA_DOMAIN = f"{JIRA_DOMAIN}.atlassian.net"

def jira_request(method, path, data=None):
    url = f"https://{JIRA_DOMAIN}/rest/api/3{path}"
    auth = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body_err = e.read().decode()
        print(f"Jira error {e.code}: {body_err[:500]}", file=sys.stderr)
        return None

def text_node(t):
    return {"type": "text", "text": str(t)}

def bold_text(t):
    return {"type": "text", "text": str(t), "marks": [{"type": "strong"}]}

def heading(level, t):
    return {
        "type": "heading",
        "attrs": {"level": level},
        "content": [text_node(t)]
    }

def paragraph(*nodes):
    return {"type": "paragraph", "content": list(nodes)}

def bullet_list(items):
    return {
        "type": "bulletList",
        "content": [
            {
                "type": "listItem",
                "content": [paragraph(text_node(item))]
            }
            for item in items
        ]
    }

def table_adf(headers, rows):
    header_cells = [
        {
            "type": "tableHeader",
            "content": [paragraph(bold_text(h))]
        }
        for h in headers
    ]
    header_row = {"type": "tableRow", "content": header_cells}
    
    data_rows = []
    for row in rows:
        cells = [
            {
                "type": "tableCell",
                "content": [paragraph(text_node(c))]
            }
            for c in row
        ]
        data_rows.append({"type": "tableRow", "content": cells})
    
    return {
        "type": "table",
        "attrs": {"isNumberColumnEnabled": False, "layout": "default"},
        "content": [header_row] + data_rows
    }


def build_description(ecosystem, eco_data):
    releases = eco_data.get("releases", [])
    nexus_verified = eco_data.get("nexus_verified", [])
    vex_status = eco_data.get("vex_status", {})
    cves = eco_data.get("cves", [])
    
    content = []
    
    # Release Summary
    content.append(heading(2, "Release Summary"))
    release_items = [f"Ecosystem: {ecosystem}"]
    for rel in releases:
        modules = rel.get("modules")
        if modules:
            release_items.append(f"{rel['name']} {rel['version']} (uploaded: {rel['uploaded']}, modules: {len(modules)})")
        else:
            release_items.append(f"{rel['name']} {rel['version']} (uploaded: {rel['uploaded']})")
    content.append(bullet_list(release_items))
    
    # Nexus Verification
    content.append(heading(2, "Nexus Verification"))
    nexus_rows = []
    for nv in nexus_verified:
        nexus_rows.append([
            nv["package"],
            nv["version"],
            nv["repository"],
            "Yes" if nv["found"] else "No"
        ])
    if nexus_rows:
        content.append(table_adf(
            ["Package", "Patched Version", "Repository", "Artifact Found"],
            nexus_rows
        ))
    
    # VEX Status
    content.append(heading(2, "VEX Status"))
    vex_items = []
    available = vex_status.get("available", [])
    pending = vex_status.get("pending", [])
    if available:
        vex_items.append("VEX available:")
        for a in available[:20]:
            vex_items.append(f"  - {a}")
    if pending:
        vex_items.append("Pending VEX:")
        for p in pending[:20]:
            vex_items.append(f"  - {p}")
    if vex_items:
        content.append(bullet_list(vex_items))
    
    # Resolved CVEs (limit to top relevant ones)
    content.append(heading(2, "Resolved CVEs"))
    
    # Group CVEs by package and limit
    cve_by_pkg = {}
    for cve in cves:
        pkg = cve.get("package", "unknown")
        if pkg not in cve_by_pkg:
            cve_by_pkg[pkg] = []
        cve_by_pkg[pkg].append(cve)
    
    cve_rows = []
    for pkg, pkg_cves in sorted(cve_by_pkg.items()):
        # Limit to 15 CVEs per package for readability
        for cve_entry in sorted(pkg_cves, key=lambda x: x.get("severity", ""), reverse=True)[:15]:
            cve_rows.append([
                pkg,
                cve_entry.get("cve_id", ""),
                cve_entry.get("severity", "Unknown"),
                cve_entry.get("vulnerable_versions", "Unknown")[:80],
                cve_entry.get("fixed_in", ""),
            ])
    
    if len(cve_rows) > 100:
        cve_rows = cve_rows[:100]
        content.append(paragraph(text_node(f"Showing top 100 of {len(cves)} total CVEs. Full list truncated for readability.")))
    
    if cve_rows:
        content.append(table_adf(
            ["Package", "CVE ID", "Severity", "Vulnerable Versions", "Fixed In Version"],
            cve_rows
        ))
    
    # Planned Documentation Changes
    content.append(heading(2, "Planned Documentation Changes (future PR)"))
    doc_items = []
    for rel in releases:
        name = rel["name"]
        version = rel["version"]
        
        # Check if package already has a page in docs
        existing_pages = {
            "angular": ("existing page update", True, True),
            "vite": ("existing page update", True, True),
            "next": ("existing page update", True, True),
            "jspdf": ("javascript-libraries general page update", False, False),
            "mysql2": ("existing page update", True, True),
            "nuxt": ("existing page update", True, True),
            "tar": ("javascript-libraries general page update", False, False),
            "rollup": ("javascript-libraries general page update", False, False),
            "debug": ("javascript-libraries general page update", False, False),
            "semver": ("javascript-libraries general page update", False, False),
            "cross-spawn": ("javascript-libraries general page update", False, False),
            "terser": ("javascript-libraries general page update", False, False),
            "mout": ("javascript-libraries general page update", False, False),
            "requirejs": ("existing page update", True, True),
            "cryptography": ("python-libraries general page update", False, False),
            "NHibernate": ("new dedicated page or dotnet page update", True, True),
            "Apache Tomcat": ("existing page update", True, True),
        }
        
        matched = None
        for key_name, (decision, update_vue, update_sidebar) in existing_pages.items():
            if key_name.lower() in name.lower():
                matched = (decision, update_vue, update_sidebar)
                break
        
        if not matched:
            matched = ("ecosystem general page update", False, False)
        
        decision, update_vue, update_sidebar = matched
        
        doc_items.append(f"{name}:")
        doc_items.append(f"  Decision: {decision}")
        doc_items.append(f"  Update supported versions: {version}")
        doc_items.append(f"  Update CVE section: Yes")
        doc_items.append(f"  Update install instructions: No")
        doc_items.append(f"  Update ELSTechnology.vue: {'Yes' if update_vue else 'No'}")
        doc_items.append(f"  Update sidebar: {'Yes' if update_sidebar else 'No'}")
    
    content.append(bullet_list(doc_items))
    
    # Pending Items / Risks
    content.append(heading(2, "Pending Items / Risks"))
    risk_items = []
    if pending:
        risk_items.append("Pending VEX:")
        for p in pending[:15]:
            risk_items.append(f"  - {p}")
    
    unknown_cves = [c for c in cves if c.get("severity") == "Unknown" or c.get("vulnerable_versions") == "Unknown"]
    if unknown_cves:
        risk_items.append("Missing CVE metadata:")
        for c in unknown_cves[:10]:
            reasons = []
            if c.get("severity") == "Unknown":
                reasons.append("severity unknown")
            if c.get("vulnerable_versions") == "Unknown":
                reasons.append("vulnerable range unknown")
            risk_items.append(f"  - {c['cve_id']}: {', '.join(reasons)}")
    
    nexus_misses = [nv for nv in nexus_verified if not nv.get("found")]
    if nexus_misses:
        risk_items.append("Nexus misses:")
        for nm in nexus_misses:
            risk_items.append(f"  - {nm['package']} {nm['version']}")
    
    if not risk_items:
        risk_items.append("No pending items or risks identified.")
    
    content.append(bullet_list(risk_items))
    
    return {"version": 1, "type": "doc", "content": content}


def create_jira_task(summary, description_adf):
    payload = {
        "fields": {
            "project": {"key": "ELSDOC"},
            "summary": summary,
            "issuetype": {"name": "Task"},
            "description": description_adf,
        }
    }
    result = jira_request("POST", "/issue", payload)
    if result:
        return result.get("key")
    return None

def update_jira_description(issue_key, description_adf):
    payload = {
        "fields": {
            "description": description_adf,
        }
    }
    url = f"https://{JIRA_DOMAIN}/rest/api/3/issue/{issue_key}"
    auth = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()
    headers = {
        "Authorization": f"Basic {auth}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    body = json.dumps(payload).encode()
    req = urllib.request.Request(url, data=body, headers=headers, method="PUT")
    try:
        resp = urllib.request.urlopen(req, timeout=30)
        return True
    except urllib.error.HTTPError as e:
        body_err = e.read().decode()
        print(f"Jira update error {e.code}: {body_err[:500]}", file=sys.stderr)
        return False


def main():
    with open("/tmp/enrich-output.json") as f:
        enriched = json.load(f)
    
    created_tasks = {}
    
    for ecosystem, eco_data in enriched.items():
        if not eco_data.get("releases"):
            continue
        
        print(f"\nProcessing {ecosystem}...", file=sys.stderr)
        
        description_adf = build_description(ecosystem, eco_data)
        
        if ecosystem == "Python":
            # Update existing ELSDOC-206 (In Progress)
            print("  Updating ELSDOC-206...", file=sys.stderr)
            success = update_jira_description("ELSDOC-206", description_adf)
            if success is not None:
                print("  -> Updated ELSDOC-206", file=sys.stderr)
                created_tasks[ecosystem] = "ELSDOC-206"
            else:
                # Fallback: create new
                date_str = "2026-03-20"
                summary = f"ELS {ecosystem} releases – {date_str}"
                key = create_jira_task(summary, description_adf)
                if key:
                    print(f"  -> Created {key}", file=sys.stderr)
                    created_tasks[ecosystem] = key
        else:
            date_str = "2026-03-20"
            summary = f"ELS {ecosystem} releases – {date_str}"
            key = create_jira_task(summary, description_adf)
            if key:
                print(f"  -> Created {key}", file=sys.stderr)
                created_tasks[ecosystem] = key
            else:
                print(f"  -> FAILED to create task", file=sys.stderr)
    
    print(json.dumps(created_tasks, indent=2))


if __name__ == "__main__":
    main()
