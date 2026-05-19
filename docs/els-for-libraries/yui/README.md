# YUI

Endless Lifecycle Support (ELS) for YUI from TuxCare provides security fixes for YUI versions that have reached their end of life. This allows you to continue running YUI applications without vulnerability concerns, even after official support has ended.

## Supported YUI Versions

* YUI 2.9.0, 3.18.1

## Installation

<ELSPrerequisites>

* **npm** package manager installed
* TuxCare registry token — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_js) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

<ELSSteps>

1. **Create or update the .npmrc file**

   Navigate to the root directory of your YUI project and create a `.npmrc` file or update it if it already exists.

   **Example:**

   ```text
   my-yui-project/
   ├── node_modules/
   ├── package.json
   ├── .npmrc         ⚠️ ← Create it here
   └── package-lock.json
   ```

2. **Configure the npm registry**

   Use an editor of your choice (e.g., VS Code) to add the following registry address lines to the `.npmrc` file:

   ```text
   registry=https://registry.npmjs.org/
   @els-js:registry=https://nexus.repo.tuxcare.com/repository/els_js/
   //nexus.repo.tuxcare.com/repository/els_js/:_auth=${TOKEN}
   ```

   :::warning
   Replace `${TOKEN}` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

3. **Update dependencies**

   Update your `package.json` file to replace YUI dependencies with TuxCare-maintained packages:

     <TableTabs label="Choose YUI version: " >

      <template #yui_2.9.0>

      ```text
      "dependencies": {
        "yui2": "npm:@els-js/yui2@>=2.9.0-tuxcare.1"
      },
      "overrides": {
        "yui2@2.9.0": "npm:@els-js/yui2@>=2.9.0-tuxcare.1"
      }
      ```

      </template>

      <template #yui_3.18.1>

      ```text
      "overrides": {
        "hoek@0.9.1": "npm:@els-js/hoek@>=0.9.1-tuxcare.1",
        "mime@1.2.11": "npm:@els-js/mime@>=1.2.11-tuxcare.1",
        "tunnel-agent@0.4.3": "npm:@els-js/tunnel-agent@>=0.4.3-tuxcare.1",
        "qs@1.0.2": "npm:@els-js/qs@>=1.0.2-tuxcare.1",
        "hawk@1.1.1": "npm:@els-js/hawk@>=1.1.1-tuxcare.1",
        "form-data@0.1.4": "npm:@els-js/form-data@>=0.1.4-tuxcare.1"
      }
      ```

      </template>

     </TableTabs>

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

   After reviewing the dependencies, run your application to ensure everything works correctly. The `npm` tool should be able to identify and resolve dependencies from the TuxCare ELS for YUI repository.

</ELSSteps>

## Resolved CVEs

Fixes for the following vulnerabilities are available in ELS for YUI from TuxCare versions:

<TableTabs label="Choose YUI version: " >

<template #yui_2.9.0>

|    CVE ID     | CVE Type | Severity | Affected Libraries | Vulnerable Versions |
|:-------------:|:--------:|:--------:|:------------------:|:-------------------:|
| CVE-2012-5881 | Direct   | Medium   | yui                | >= 2.4.0 <= 2.9.0  |

</template>

<template #yui_3.18.1>

|    CVE ID     | CVE Type  | Severity | Affected Libraries | Vulnerable Versions |
|:-------------:|:---------:|:--------:|:------------------:|:-------------------:|
| CVE-2018-3728 | Transitive | High     | hoek               | < 4.2.0, >= 5.0.0 < 5.0.3 |
| CVE-2020-36604 | Transitive | High     | hoek               | < 8.5.1, >= 9.0 < 9.0.3 |
| CVE-2017-16138 | Transitive | High     | mime               | < 1.4.1, >= 2.0.1 < 2.0.3 |
| GHSA-xc7v-wxcw-j472 | Transitive | High     | tunnel-agent       | < 0.6.0 |
| CVE-2022-24999 | Transitive | High     | qs                 | - |
| CVE-2017-1000048 | Transitive | High     | qs                 | - |
| CVE-2022-29167 | Transitive | High     | hawk               | < 9.0.1 |
| CVE-2016-2515 | Transitive | High     | hawk               | 3.1.2, 4.1.0 |
| CVE-2025-7783 | Transitive | Critical | form-data          | - |

</template>

</TableTabs>

If you are interested in the TuxCare Endless Lifecycle Support, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).

## What's Next?

<WhatsNext hide-title>

* ![](/images/eye.webp) [CVE tracker](https://tuxcare.com/cve-tracker/?q=yui) — Track vulnerability fixes and updates
* ![](/images/shield.webp) [Available fixes](https://tuxcare.com/cve-tracker/fixes?q=yui) — Patched versions and changelogs
* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/yui/) — Vulnerability Exploitability eXchange feed
* ![](/images/unlock-alt.webp) [SBOM](https://nexus.repo.tuxcare.com/#browse/browse:els-js-sbom:yui) — Software Bill of Materials (Nexus, credentials required)
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Update to newer versions

</WhatsNext>

