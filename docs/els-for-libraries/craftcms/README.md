# CraftCMS

Endless Lifecycle Support (ELS) for CraftCMS from TuxCare provides security fixes for versions that have reached their end-of-life. This allows you to continue running your applications without vulnerability concerns, even after official support has ended.

## Supported Versions and Components

* **CraftCMS** 3.x

Other versions upon request.

## Installation

<ELSPrerequisites>

* Nexus repository access credentials (username and password) — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_php) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

1. Locate the `auth.json` file

   Composer reads credentials from a per-user `auth.json`. Create or edit the file at:

   * **Linux/macOS**: 
     
     ```
     ~/.composer/auth.json
     ```

   * **Windows**:
   
     ```
     %APPDATA%\Composer\auth.json
     ```

2. Add your TuxCare credentials

   Use either the Composer CLI or edit `auth.json` directly to add credentials for `nexus.repo.tuxcare.com`:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: `composer config --global --auth http-basic.nexus.repo.tuxcare.com USERNAME PASSWORD` },
     { title: 'auth.json', content: authjson }
   ]" />

   Replace `USERNAME` and `PASSWORD` with the credentials provided by TuxCare.

3. Register the TuxCare repository

   Add the `els_php` Composer repository either via CLI or by editing `composer.json`:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: cli },
     { title: 'composer.json', content: composerjson }
   ]" />

4. Install CraftCMS

   Install the TuxCare-maintained CraftCMS release that matches your project:

   <CodeTabs :tabs="[
     { title: 'Composer CLI', content: `composer require craftcms/cms:3.9.15-p3+tuxcare` },
     { title: 'composer.json', content: packagejson }
   ]" />

   **Check the exact version listed in your TuxCare Nexus account to ensure you receive the most recent patched release.**

   :::tip

   If you edited `composer.json` manually, run `composer update` to install the package:
   
   ```
   composer update
   ```
   
   Composer will resolve dependencies against the TuxCare repository and install the patched releases.

   :::

### Composer Repository Configuration

If you encounter dependency resolution errors like:

`packages from higher priority repository do not match your constraint`

it usually means your project requires a package version that is not yet available in the TuxCare repository.

**Solution**: Update your `composer.json` to set the TuxCare repository as non-canonical:

```
{
    "repositories": [
        {
            "type": "composer",
            "url": "https://nexus.repo.tuxcare.com/repository/els_php/",
            "canonical": false
        }
    ]
}
```

This allows Composer to fall back to Packagist for packages not available in the TuxCare repository, while still preferring TuxCare patches when available.

## Resolved CVEs in CraftCMS

| CVE-ID            | Severity | Vulnerable versions                 | Fixed in Version  |
| ----------------- | -------- | ----------------------------------- | ----------------- |
| CVE-2025-35939    | Medium   | >=3.11, <4.15.3, >=5.0.0, <5.7.5    | 3.9.15-p1+tuxcare |
| CVE-2025-54417    | Medium   | >=3.0.0, <4.16.3, >=5.0.0, <5.8.4   | 3.9.15-p1+tuxcare |
| AIKIDO-2025-10090 | Medium   | <4.14.15, >=5.0.0, <5.6.6           | 3.9.15-p1+tuxcare |
| CVE-2024-52291    | High     | >=3.0.0, 4.12.5,  >=5.0.0, <5.4.6   | 3.9.15-p1+tuxcare |
| CVE-2025-68456    | Critical | >=3.0.0, <4.6.17, >=5.0.1, <5.8.21  | 3.9.15-p1+tuxcare |
| CVE-2026-27128    | Medium   | >=2.1.0, <4.16.19, >=5.0.0, <5.8.22 | 3.9.15-p1+tuxcare |
| CVE-2026-25493    | Low      | >=3.0.0, <4.15.16, >=5.0.0, <5.8.19 | 3.9.15-p1+tuxcare |
| CVE-2026-25495    | High     | >=1.0.0, <4.16.18, >=5.0.0, <5.8.22 | 3.9.15-p1+tuxcare |
| CVE-2023-33495    | Medium   | <4.4.12                             | 3.9.15-p1+tuxcare |
| CVE-2026-29069    | Medium   | >=4.0.0, <4.17.0                    | 3.9.15-p2+tuxcare |
| CVE-2026-28783    | Medium   | >=4.0.0, <4.17.0                    | 3.9.15-p2+tuxcare |
| CVE-2026-27127    | High     | >=3.0.0, <4.17.1                    | 3.9.15-p3+tuxcare |
| CVE-2026-32267    | High     | >=3.0.0, <4.17.1                    | 3.9.15-p3+tuxcare |
| CVE-2025-68437    | Medium   | >=3.0.0, <4.17.1                    | 3.9.15-p3+tuxcare |

## What's Next?

<WhatsNext hide-title>

* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_php/craftcms/cms/) — Vulnerability Exploitability eXchange feed
* ![](/images/eye.webp) [CVE Tracker](https://tuxcare.com/cve-tracker/) — Track vulnerability fixes and updates
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Upgrade to a newer version

</WhatsNext>

<script setup>

const authjson =
`{
  "http-basic": {
    "nexus.repo.tuxcare.com": {
      "username": "USERNAME",
      "password": "PASSWORD"
    }
  }
}`

const composerjson =
`{
    "repositories": [
        {
        "type": "composer",
        "url": "https://nexus.repo.tuxcare.com/repository/els_php/",
        "options": {
            "http": {
            "verify": true
            }
        }
        }
    ]
}`

const cli =
`composer config repositories.tuxcare '{"type":"composer","url":"https://nexus.repo.tuxcare.com/repository/els_php/","options":{"http":{"verify":true}}}' --json`

const packagejson =
`{
    "require": {
        "craftcms/cms": "3.9.15-p3+tuxcare"
    }
}`

</script>
