# Endless Lifecycle Support

Endless Lifecycle Support (ELS) from TuxCare provides security fixes for software that has reached end of life — [operating systems](/els-for-os/), [runtimes](/els-for-runtimes/), [language ecosystems](/els-for-libraries/) and [applications](/els-for-applications/). It lets you keep running what you have without a rushed upgrade or a code rewrite. [SecureChain](/securechain/) covers open-source packages that are still supported upstream, with verified, signed builds whose coverage carries on past end of life.

Start here to find the product that fits your case and see how ELS is delivered. Installation steps are on each product page.

## Choose your product

| What do you want to do? | Product | What it covers |
| :--- | :--- | :--- |
| Patch an end-of-life Linux server | [ELS for Operating Systems](/els-for-os/) | CentOS, Oracle Linux, RHEL, Debian, Ubuntu and others — no rebuilds, no downtime |
| Stay on an end-of-life runtime | [ELS for Runtimes](/els-for-runtimes/) | PHP, Python, Node.js, Ruby, .NET and OpenJDK — no code changes |
| Patch an end-of-life dependency | [ELS for Language Ecosystems](/els-for-libraries/) | JavaScript, Java, Python, PHP and .NET packages — no rewrites |
| Secure an end-of-life application | [ELS for Applications](/els-for-applications/) | MySQL, MariaDB, PostgreSQL, Apache Tomcat, Grafana and others |
| Harden packages still supported upstream | [SecureChain for Open Source](/securechain/) | Signed, verified builds from a TuxCare registry. JavaScript today |

## How ELS reaches your system

TuxCare delivers ELS in three ways. Which one applies depends on what you are patching; the product page tells you which one your software uses.

### A repository on the server

You run an installation script with your license key. The script registers a TuxCare repository, and from then on your usual package manager does the work — `yum upgrade` or `apt upgrade`. Patched packages replace the end-of-life ones in place, and your update routine stays the same.

This is how you get:

* [ELS for Operating Systems](/els-for-os/)
* [ELS for Runtimes](/els-for-runtimes/): PHP, Python, Node.js, Ruby and OpenJDK
* [ELS for Applications](/els-for-applications/): MySQL, MariaDB, PostgreSQL and Percona Server

### A registry for your build

You get Nexus credentials and point your package manager or build tool at the TuxCare registry — npm, Maven or Gradle, pip, Composer, NuGet — configured the way it normally is. Patched releases are drop-in replacements published under the same package names with a TuxCare suffix in the version, for example `19.2.23-tuxcare.1`, so your dependency declarations keep working.

This is how you get:

* [ELS for Language Ecosystems](/els-for-libraries/)
* [ELS for Applications](/els-for-applications/): Apache Tomcat, WildFly, Apache Maven, Gradle, Apache Hadoop, Apache Hive, Grafana, Loki and MinIO

### A download link

You get a secure, tokenized download link and install the patched build with its regular installer.

This is how you get [ELS for Runtimes](/els-for-runtimes/dotnet/): .NET.

## Getting access

What you need depends on the delivery model:

* **A license key** for a repository on the server. The installation script takes it as an argument.
* **Nexus credentials** (a username and password) for the registry. Your package manager or build tool uses them.
* **A tokenized download link** for a download.

Contact [sales@tuxcare.com](mailto:sales@tuxcare.com) to get a license key, Nexus credentials or a download link.

## Getting started

1. **Choose your product** in the [table above](#choose-your-product) and open its page.
2. **Get access** — see [Getting access](#getting-access).
3. **Follow the installation steps** for your software on the product page.
4. **Verify the installation.** Each installation guide ends with a check: the TuxCare repository is enabled, or the installed versions carry the TuxCare suffix.
5. **Stay up to date.**
   * Install updates the way you usually do. See Managing the ELS repository for [operating systems](/els-for-os/managing-els-repository/), [language ecosystems](/els-for-libraries/managing-els-repository/) and [applications](/els-for-applications/managing-els-repository/).
   * Get notified about new fixes by email or RSS. See Tracking security updates for [operating systems](/els-for-os/tracking-security-updates/), [runtimes](/els-for-runtimes/tracking-security-updates/), [language ecosystems](/els-for-libraries/tracking-security-updates/) and [applications](/els-for-applications/tracking-security-updates/).

## Security data

* **Check what has been fixed** in the [CVE Tracker](https://tuxcare.com/cve-tracker/).
* **Feed a compliance pipeline** with SBOM, VEX, OVAL, CSAF, errata and other machine-readable data. See Machine-readable security data for [operating systems](/els-for-os/machine-readable-security-data/), [runtimes](/els-for-runtimes/machine-readable-security-data/), [language ecosystems](/els-for-libraries/machine-readable-security-data/) and [applications](/els-for-applications/machine-readable-security-data/).

## What's Next?

<WhatsNext hide-title>

* ![](/images/box.webp) [ELS for Operating Systems](/els-for-os/) — Post-EOL patching for end-of-life Linux distributions
* ![](/images/bolt.webp) [ELS for Runtimes](/els-for-runtimes/) — PHP, Python, Node.js, Ruby, .NET and OpenJDK beyond their EOL
* ![](/images/books.webp) [ELS for Language Ecosystems](/els-for-libraries/) — Patched JavaScript, Java, Python, PHP and .NET packages
* ![](/images/clipboard-notes.webp) [ELS for Applications](/els-for-applications/) — Security fixes for end-of-life open-source applications
* ![](/images/star.webp) [SecureChain for Open Source](/securechain/) — Signed, verified packages from a TuxCare-managed registry
* ![](/images/shield.webp) [Support Portal](https://tuxcare.com/support-portal/) — Open a ticket with the TuxCare team

</WhatsNext>
