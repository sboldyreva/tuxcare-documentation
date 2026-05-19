# AngularJS

Endless Lifecycle Support (ELS) for AngularJS from TuxCare provides security fixes for AngularJS versions that have reached their end of life. This allows you to continue running AngularJS applications without vulnerability concerns, even after official support has ended.

## Supported AngularJS Versions

* AngularJS 1.4.4, 1.5.11, 1.6.10, 1.7.9, 1.8.2, 1.8.3

## Installation

<ELSPrerequisites>

* **npm** package manager installed
* TuxCare registry token — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_angularjs) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

<ELSSteps>

1. **Create or update the .npmrc file**

   Navigate to the root directory of your AngularJS project and create a `.npmrc` file or update it if it already exists.

   **Example:**

   ```text
   my-angularjs-project/
   ├── node_modules/
   ├── package.json
   ├── .npmrc         ⚠️ ← Create it here
   └── package-lock.json
   ```

2. **Configure the npm registry**

   Use an editor of your choice (e.g., VS Code) to add the following registry address lines to the `.npmrc` file:

   ```text
   registry=https://registry.npmjs.org/
   @els-angularjs:registry=https://nexus.repo.tuxcare.com/repository/els_angularjs/
   //nexus.repo.tuxcare.com/repository/els_angularjs/:_auth=${TOKEN}
   ```

   :::warning
   Replace `${TOKEN}` with the token you received from [sales@tuxcare.com](mailto:sales@tuxcare.com).
   :::

3. **Update dependencies**

   Manually update your `package.json` file by replacing AngularJS dependencies with TuxCare-maintained packages.

     <TableTabs label="Choose AngularJS version: " >

      <template #AngularJS_1.4.4>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.4.4-tuxcare.1"
      },
      "overrides": {
          "angular@1.4.4": "npm:@els-angularjs/angular@>=1.4.4-tuxcare.1"
      }
      ```

      </template>

      <template #AngularJS_1.5.11>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.5.11-tuxcare.1"
      },
      "overrides": {
          "angular@1.5.11": "npm:@els-angularjs/angular@>=1.5.11-tuxcare.1"
      }
      ```

      </template>

      <template #AngularJS_1.6.10>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.6.10-tuxcare.1"
      },
      "overrides": {
          "angular@1.6.10": "npm:@els-angularjs/angular@>=1.6.10-tuxcare.1"
      }
      ```

      </template>

      <template #AngularJS_1.7.9>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.7.9-tuxcare.1"
      },
      "overrides": {
          "angular@1.7.9": "npm:@els-angularjs/angular@>=1.7.9-tuxcare.1"
      }
      ```

      </template>

      <template #AngularJS_1.8.2>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.8.2-tuxcare.1"
      },
      "overrides": {
          "angular@1.8.2": "npm:@els-angularjs/angular@>=1.8.2-tuxcare.1"
      }
      ```

      </template> 

      <template #AngularJS_1.8.3>

      ```text
      "dependencies": {
          "angular": "npm:@els-angularjs/angular@>=1.8.3-tuxcare.1"
      },
      "overrides": {
          "angular@1.8.3": "npm:@els-angularjs/angular@>=1.8.3-tuxcare.1"
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

   After reviewing the dependencies, run your application to ensure everything works correctly. The `npm` tool should be able to identify and resolve dependencies from the TuxCare ELS for AngularJS repository.

</ELSSteps>

## Resolved CVEs

Fixes for the following vulnerabilities are available in ELS for AngularJS from TuxCare versions:

|     CVE ID     | CVE Type | Severity | Affected Libraries | Vulnerable Versions |
| :------------: | :------: | :------: | :----------------: | :-----------------: |
| CVE-2019-10768 |  Direct  | Critical |      AngularJS     |        <1.7.9       |
| CVE-2024-21490 |  Direct  |   High   |      AngularJS     |       >=1.3.0       |
|  CVE-2025-4690 |  Direct  |  Medium  |  Angular Sanitize  |       >=0.0.0       |
|  CVE-2025-4690 |  Direct  |  Medium  |      AngularJS     |       >=0.0.0       |
|  CVE-2025-2336 |  Direct  |  Medium  |      AngularJS     |       >=1.3.1       |
|  CVE-2025-2336 |  Direct  |  Medium  |  Angular Sanitize  |       >=1.3.1       |
|  CVE-2025-0716 |  Direct  |  Medium  |      AngularJS     |       >=0.0.0       |
|  CVE-2024-8373 |  Direct  |  Medium  |      AngularJS     |       >=0.0.0       |
|  CVE-2024-8372 |  Direct  |  Medium  |      AngularJS     |     >=1.3.0-rc.4    |
| CVE-2024-33665 |  Direct  |  Medium  |  Angular Translate |       <2.19.1       |
| CVE-2023-26118 |  Direct  |  Medium  |      AngularJS     |       >=1.4.9       |
| CVE-2023-26117 |  Direct  |  Medium  |      AngularJS     |       >=1.0.0       |
| CVE-2023-26116 |  Direct  |  Medium  |      AngularJS     |       >=1.2.21      |
| CVE-2022-25869 |  Direct  |  Medium  |      AngularJS     |       >=0.0.0       |
| CVE-2022-25844 |  Direct  |  Medium  |      AngularJS     |       >=1.7.0       |
|  CVE-2020-7676 |  Direct  |  Medium  |      AngularJS     |        <1.8.0       |
| GHSA-5cp4-xmrw-59wf |  Direct  |  Medium  |      AngularJS     |        <1.8.0       |
| GHSA-28hp-fgcr-2r4h |  Direct  |  Medium  |      AngularJS     |        <1.6.0       |
| CVE-2019-14863 |  Direct  |  Medium  |      AngularJS     |       <=1.4.14      |

If you are interested in the TuxCare Endless Lifecycle Support, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).

## What's Next?

<WhatsNext hide-title>

* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_javascript/angular/) — Vulnerability Exploitability eXchange feed
* ![](/images/unlock-alt.webp) [SBOM](https://nexus.repo.tuxcare.com/#browse/browse:els-js-sbom:angularjs) — Software Bill of Materials (Nexus, credentials required)
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Update to newer versions

</WhatsNext>

