# Vite

Endless Lifecycle Support (ELS) for Vite from TuxCare provides security fixes for Vite versions that have reached their end of life. This allows you to continue running Vite applications without vulnerability concerns, even after official support has ended.

## Supported Vite Versions

* Vite 2.9.18, 3.2.11, 4.5.14, 4.5.5, 5.4.14, 5.4.21

## Installation

<ELSPrerequisites>

* **npm** package manager installed
* TuxCare registry token — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els-vue) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

<ELSSteps>

1. **Create or update the .npmrc file**

   Navigate to the root directory of your Vite project and create a `.npmrc` file or update it if it already exists.

   **Example:**

   ```text
   my-vite-project/
   ├── node_modules/
   ├── package.json
   ├── .npmrc         ⚠️ ← Create it here
   └── package-lock.json
   ```

2. **Configure the npm registry**

   Use an editor of your choice (e.g., VS Code) to add the following registry address lines to the `.npmrc` file:

   ```text
   registry=https://registry.npmjs.org/
   @els-vue:registry=https://nexus.repo.tuxcare.com/repository/els-vue/
   //nexus.repo.tuxcare.com/repository/els-vue/:_auth=${TOKEN}
   ```

   :::warning
   Replace `${TOKEN}` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

3. **Update dependencies**

   Update your `package.json` file to replace Vite dependencies with TuxCare-maintained packages. You can do this in two ways:

   * **Option 1: Manual update**

     Manually update your `package.json` file by replacing your Vite dependencies with the TuxCare packages. This method gives you full control over which packages to update.

     ```text
     "dependencies": {
       "vite": "npm:@els-vue/vite@>=4.5.5-tuxcare.1"
     },
     "overrides": {
       "vite@4.5.5": "npm:@els-vue/vite@>=4.5.5-tuxcare.1"
     }
     ```

   * **Option 2: TuxCare Patcher (Automated)**

     Install the Patcher globally and run it. The TuxCare Patcher automatically detects the Vite version in your `package.json` and updates your `dependencies` and `overrides` to use the corresponding TuxCare `@els-vue/*` packages.

     ```text
     npm install -g @els-vue/tuxcare-patcher --userconfig ./.npmrc
     tuxcare-patch-js
     ```

     The patcher will update your `package.json`, for example, from:

     ```text
     "dependencies": {
       "vite": "^4.5.5"
     }
     ```

     to:

     ```text
     "dependencies": {
       "vite": "npm:@els-vue/vite@>=4.5.5-tuxcare.1"
     },
     "overrides": {
       "vite@4.5.5": "npm:@els-vue/vite@>=4.5.5-tuxcare.1"
     }
     ```

4. **Refresh the project dependencies**

   Remove `node_modules`, `package-lock.json`, and clear the npm cache:

   ```text
   rm -rf node_modules package-lock.json && npm cache clean --force
   ```

   Install dependencies:

   ```text
   npm install
   ```

   The token for the TuxCare repository is automatically picked up from your `.npmrc` file.

5. **Verify the setup**

   Use npm to list the project's dependencies and confirm TuxCare packages are resolved correctly:

   ```text
   npm list
   ```

   After reviewing the dependencies, run your application to ensure everything works correctly. The `npm` tool should be able to identify and resolve dependencies from the TuxCare ELS for Vite repository.

</ELSSteps>

## Resolved CVEs

Fixes for the following vulnerabilities are available in ELS for Vite from TuxCare versions:

| CVE ID         | CVE Type | Severity | Affected Libraries | Vulnerable Versions |
| :------------: | :------: |:--------:|:------------------:| :----------------: |
| CVE-2025-24010 | Direct   | Medium   | vite               | < 4.5.5, >= 5.0.0 < 5.4.12, >= 6.0.0 < 6.0.9 |
| CVE-2025-31125 | Direct   | High     | vite               | < 4.5.11, >= 5.0.0 < 5.4.16, >= 6.0.0 < 6.0.13, >= 6.1.0 < 6.1.3, >= 6.2.0 < 6.2.4 |
| CVE-2025-30208 | Direct   | High     | vite               | < 4.5.10, >= 5.0.0 < 5.4.15, >= 6.0.0 < 6.0.12, >= 6.1.0 < 6.1.2, >= 6.2.0 < 6.2.3 |
| CVE-2025-32395 | Direct   | Medium   | vite               | < 6.2.6, < 6.1.5, < 6.0.15, < 5.4.18, < 4.5.13 |
| CVE-2025-46565 | Direct   | Medium   | vite               | < 4.5.14, >= 5.0.0 < 5.4.19, >= 6.0.0 < 6.1.6, >= 6.2.0 < 6.2.7, >= 6.3.0 < 6.3.4 |
| CVE-2025-31486 | Direct   | Medium   | vite               | > 6.0.0 |
| CVE-2025-58751 | Direct   | Low      | vite               | < 5.4.20, >= 6.0.0 < 6.3.6, >= 7.0.0 < 7.0.7, >= 7.1.0 < 7.1.5 |
| CVE-2025-58752 | Direct   | Low      | vite               | < 5.4.20, >= 6.0.0 < 6.3.6, >= 7.0.0 < 7.0.7, >= 7.1.0 < 7.1.5 |

If you are interested in the TuxCare Endless Lifecycle Support, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).

## What's Next?

<WhatsNext hide-title>

* ![](/images/eye.webp) [CVE tracker](https://tuxcare.com/cve-tracker/?q=vite) — Track vulnerability fixes and updates
* ![](/images/shield.webp) [Available fixes](https://tuxcare.com/cve-tracker/fixes?product=Vite) — Patched versions and changelogs
* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/vite/) — Vulnerability Exploitability eXchange feed
* ![](/images/unlock-alt.webp) [SBOM](https://nexus.repo.tuxcare.com/#browse/browse:els-js-sbom:vite) — Software Bill of Materials (Nexus, credentials required)
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Update to newer versions

</WhatsNext>

