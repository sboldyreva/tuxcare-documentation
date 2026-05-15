# Django

Endless Lifecycle Support (ELS) for Libraries from TuxCare provides security fixes for Django. This allows you to continue running your Django applications without vulnerability concerns, even after official support has ended.

## Supported Django Versions

* **Django** 3.2.25, 4.0, 4.2, 5.0, 5.0.1, 5.0.2, 5.1, 5.1.4, 5.1.9

Other versions upon request.

## Installation

<ELSPrerequisites>

* **pip** package manager installed
* Nexus repository access credentials (username and password) — contact [sales@tuxcare.com](mailto:sales@tuxcare.com)
* To browse available artifacts, visit TuxCare [Nexus](https://nexus.repo.tuxcare.com/#browse/browse:els_python) and click Sign in in the top right corner. You may need to refresh the page after logging in.

</ELSPrerequisites>

#### Option 1: Install via command line

You can install or upgrade a package directly using the ELS repository with your credentials:

```text
pip install --upgrade -i https://USERNAME:PASSWORD@nexus.repo.tuxcare.com/repository/els_python/simple django
```

Here `USERNAME` and `PASSWORD` are your TuxCare credentials.

#### Option 2: Configure `pip` to use the ELS repository (full replacement)

This method is recommended if you want to use only ELS-patched Python packages from TuxCare and replace the default PyPI source with the TuxCare ELS repository.

1. Create or update the `pip` configuration file and add the following:

   <CodeTabs :tabs="[
   { title: 'Linux/macOS (~/.pip/pip.conf)', content:
   `[global]
   index-url = https://username:password@nexus.repo.tuxcare.com/repository/els_python/simple` },
   { title: 'Windows (%APPDATA%\pip\pip.ini)', content:
   `[global]
   index-url = https://username:password@nexus.repo.tuxcare.com/repository/els_python/simple` }
   ]" />

2. Run the command to install the latest package version:

   ```text
   pip install --upgrade django
   ```

   Or install a specific patched TuxCare version, for example:

   ```text
   pip install django==3.2.25.post1+tuxcare
   ```

#### Option 3: Add the TuxCare ELS repository as additional (recommended)

If you want to keep using public PyPI and fetch only specific patched packages from TuxCare, use *extra-index-url* instead. In this configuration, make sure to specify the exact patched version, otherwise `pip` may install the version from public PyPI.

1. Create or update the `pip` configuration file and add the following:

   <CodeTabs :tabs="[
   { title: 'Linux/macOS (~/.pip/pip.conf)', content:
   `[global]
   extra-index-url = https://username:password@nexus.repo.tuxcare.com/repository/els_python/simple` },
   { title: 'Windows (%APPDATA%\pip\pip.ini)', content:
   `[global]
   extra-index-url = https://username:password@nexus.repo.tuxcare.com/repository/els_python/simple` }
   ]" />

2. Run the command to install a specific patched TuxCare version, for example:

   ```text
   pip install django==3.2.25.post1+tuxcare
   ```

## What's Next?

<WhatsNext hide-title>

* ![](/images/eye.webp) [CVE tracker](https://tuxcare.com/cve-tracker/?product=Django) — Track vulnerability fixes and updates
* ![](/images/shield.webp) [Available fixes](https://tuxcare.com/cve-tracker/fixes?product=Django) — Patched versions and changelogs
* ![](/images/clipboard-notes.webp) [Supported components](https://tuxcare.com/cve-tracker/products?product=Django) — Full list of product parts covered by ELS
* ![](/images/shield-alert.webp) [VEX feed](https://security.tuxcare.com/vex/cyclonedx/els_lang_python/django/) — Vulnerability Exploitability eXchange feed
* ![](/images/unlock-alt.webp) [SBOM](https://nexus.repo.tuxcare.com/#browse/browse:els_python_sbom:django) — Software Bill of Materials (Nexus, credentials required)
* ![](/images/wrench.webp) [Managing the ELS repository](/els-for-libraries/managing-els-repository/) — Update to newer versions

</WhatsNext>
