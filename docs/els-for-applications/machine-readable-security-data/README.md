# Machine-Readable Security Data (SBOM, VEX, GPG)

TuxCare provides machine-readable security data for ELS for Open-Source Applications in the following formats:

* **SBOM (Software Bill of Materials)** - package composition and dependency inventory in SPDX and CycloneDX formats
* **VEX (Vulnerability Exploitability eXchange)** - exploitability status for known CVEs in CycloneDX VEX format

TuxCare also signs every application artifact so you can verify its authenticity and integrity before installing — see [Package Signature Verification (GPG)](#package-signature-verification-gpg).

Released fixes are available via [tuxcare.com/cve-tracker](https://tuxcare.com/cve-tracker/) and [security.tuxcare.com](https://security.tuxcare.com/).

## Software Bill of Materials (SBOM)

Each application package built by TuxCare ships with an SBOM that lists its components, versions, and dependency relationships. SBOMs are provided in industry-standard formats — SPDX and CycloneDX — so they can be consumed by any SBOM-aware scanner or supply-chain tool.

To check whether an SBOM is available for a specific application or to request a copy, reach out to [sales@tuxcare.com](mailto:sales@tuxcare.com).

## Vulnerability Exploitability eXchange (VEX)

TuxCare publishes VEX as CycloneDX VEX documents, distributed alongside each package version and updated with every release. The feed is available at [security.tuxcare.com/vex/cyclonedx](https://security.tuxcare.com/vex/cyclonedx/). A VEX document tells you which known CVEs actually affect a given artifact version and which don't, so scanner results stay focused on real exposure.

Each entry links one CVE to one artifact version and carries a status:

* **exploitable** - the CVE affects this artifact version and has not yet been patched in this release.
* **resolved** - the CVE has been patched through a TuxCare release.

The feed covers every supported base version, every released `-tuxcare.N` iteration, and transitive dependencies, so the entry count reflects all of these combinations rather than the number of unique CVEs. When checking coverage, filter to the artifact versions you actually use — usually the latest `-tuxcare.N` iteration of your chosen base version. Earlier iterations remain in the feed for historical completeness but aren't relevant once you've adopted a newer release.

## Package Signature Verification (GPG)

ELS for Open-Source Applications is distributed as archives and JARs from the TuxCare [Nexus repository](https://nexus.repo.tuxcare.com) (for example, the `els_java` repository for Apache Tomcat®, Apache Hive, Apache Hadoop, and WildFly). Every artifact TuxCare builds is signed with a detached OpenPGP signature so you can confirm, before installing or updating, that the artifact was produced by TuxCare and has not been altered in transit. The signature is published as a separate `.asc` file alongside the artifact and is created with TuxCare's signing key (SHA-256 detached signature).

A successful verification proves two things about the artifact:

* **Authenticity** — it was signed by TuxCare's private key.
* **Integrity** — its bytes match exactly what was signed; no tampering or corruption occurred.

A failed verification is an **integrity violation**: the artifact must be treated as untrusted and not installed. Do not work around a failed check by re-downloading over an insecure channel or skipping verification — investigate the source instead (see [Integrity Violation Events](#integrity-violation-events)).

### Where Signatures Are Published

Signature files are published to a dedicated Nexus signatures repository, separate from the artifact repositories and mirroring the path of the artifact they sign. Accessing them requires the same TuxCare Nexus credentials as the artifact repositories. Nexus also publishes a checksum (SHA-256) for each artifact, which you can use as an additional integrity check.

### Obtain the TuxCare Public Key

To verify a signature you first need TuxCare's public signing key. Obtain the key from your TuxCare account, or request it from [sales@tuxcare.com](mailto:sales@tuxcare.com) or your TuxCare support contact.

Once you have the key file (for example, `tuxcare-els-public.asc`), import it into your keyring:

```text
gpg --import tuxcare-els-public.asc
```

Confirm it imported by listing the keys in your keyring:

```text
gpg --list-keys
```

:::tip
Import the public key once. It can verify every TuxCare-signed artifact, so this step is not repeated for each download.
:::

### Verify an Artifact

The steps below use Apache Tomcat® 8.5.100 as an example. The same flow applies to every application artifact — substitute the repository, path, and file name for the artifact you are verifying.

<ELSSteps>

1. **Obtain the exact published artifact**

   Verification works on the byte-for-byte artifact that was signed, so download the published archive as-is (do not repack or re-compress it), authenticating with your TuxCare Nexus credentials (see [sales@tuxcare.com](mailto:sales@tuxcare.com)):

   ```text
   curl -u USERNAME:PASSWORD -fsSL -O \
     https://nexus.repo.tuxcare.com/repository/els_java/org/apache/tomcat/tomcat/8.5.100-tuxcare.3/tomcat-8.5.100-tuxcare.3.tar.gz
   ```

2. **Download the matching signature**

   Fetch the `.asc` file for the same artifact from the signatures repository, using the same credentials:

   ```text
   curl -u USERNAME:PASSWORD -fsSL -O \
     https://nexus.repo.tuxcare.com/repository/els_java/org/apache/tomcat/tomcat/8.5.100-tuxcare.3/tomcat-8.5.100-tuxcare.3.tar.gz.asc
   ```

3. **Verify the signature against the artifact**

   Pass the signature file first, then the artifact you downloaded:

   ```text
   gpg --verify tomcat-8.5.100-tuxcare.3.tar.gz.asc tomcat-8.5.100-tuxcare.3.tar.gz
   ```

   A valid signature produces output similar to:

   ```text
   gpg: Signature made Mon 12 May 2025 10:14:21 UTC
   gpg:                using RSA key <TUXCARE_KEY_ID>
   gpg: Good signature from "TuxCare <...>" [unknown]
   ```

   The `Good signature` line, and a key ID that matches the TuxCare public key you imported, confirm the artifact is authentic and unmodified. (The `[unknown]` trust level only reflects that you have not personally signed TuxCare's key in your web of trust; it does not affect the validity of the signature.)

4. **(Optional) Verify the checksum**

   As an additional integrity check, compare the artifact against the SHA-256 checksum published in Nexus:

   ```text
   curl -u USERNAME:PASSWORD -fsSL -O \
     https://nexus.repo.tuxcare.com/repository/els_java/org/apache/tomcat/tomcat/8.5.100-tuxcare.3/tomcat-8.5.100-tuxcare.3.tar.gz.sha256
   sha256sum -c tomcat-8.5.100-tuxcare.3.tar.gz.sha256
   ```

   A matching checksum reports `OK`.

</ELSSteps>

If `gpg` reports `BAD signature`, or cannot find the matching public key, treat the artifact as an integrity violation: stop the installation and re-obtain the artifact and signature from TuxCare over a trusted channel.

## Integrity Violation Events

For compliance with regulations such as the EU Cyber Resilience Act (CRA), an administrator must be able to detect and retain evidence when an integrity check fails — not just discover it by chance while watching a terminal. This section defines what counts as an integrity violation for ELS for Open-Source Applications and shows how to capture these events in a dedicated log.

### What Counts as an Integrity Violation

Because application artifacts are downloaded directly from Nexus and verified explicitly (rather than through a package manager that indexes signed repository metadata), an **integrity violation** is any failure of the verification steps above. Three event types apply:

**1. GPG signature failure** — the detached signature does not match the artifact, or it was made with a key that is not TuxCare's.

```text
gpg: BAD signature from "TuxCare <...>"
# or, when the signing key is not in your keyring:
gpg: Can't check signature: No public key
```

**2. Checksum error** — the artifact's bytes do not match the published SHA-256 checksum (corruption or tampering in transit).

```text
tomcat-8.5.100-tuxcare.3.tar.gz: FAILED
sha256sum: WARNING: 1 computed checksum did NOT match
```

**3. HTTPS/TLS certificate error** — the connection to Nexus could not be authenticated, so the transport itself is untrusted and the download must not be relied upon.

```text
curl: (60) SSL certificate problem: unable to get local issuer certificate
```

:::tip
Repository **metadata signature mismatch** — a distinct event on package-manager (OS-repo) delivery — does not apply here. In the Nexus model, trust comes from the detached signature and checksum on each artifact, not from a signed repository index, so there is no separate metadata-signature step to fail.
:::

:::warning
Never bypass one of these errors by skipping verification, passing `curl -k`/`--insecure`, or re-downloading over an untrusted channel. Treat the artifact as compromised, log the event (below), and re-obtain the artifact and signature from TuxCare over a trusted channel.
:::

### Retaining Integrity Violation Events in a Dedicated Log

Because verification is an explicit step, the reliable way to retain these events is to run the check from a CI step or an install/update script and record the outcome to a dedicated log — separate from ordinary build or deployment output — so a failure is captured regardless of who ran it or when.

The wrapper below downloads an artifact and its signature, verifies both signature and checksum, and forwards any failure to the system log via `logger`, tagged so it can be isolated:

```bash
#!/bin/sh
# /usr/local/sbin/tuxcare-verify-artifact
# Verify a TuxCare application artifact and record any integrity violation.
# Usage: tuxcare-verify-artifact <artifact> <signature> <checksum-file>

TAG=tuxcare-integrity
artifact=$1 sig=$2 sum=$3

fail() {
  logger -t "$TAG" -p auth.err "INTEGRITY VIOLATION: $artifact: $1"
  echo "INTEGRITY VIOLATION: $artifact: $1" >&2
  exit 1
}

gpg --verify "$sig" "$artifact"    || fail "GPG signature verification failed"
sha256sum -c "$sum"                || fail "checksum mismatch"

logger -t "$TAG" -p auth.info "verified OK: $artifact"
echo "verified OK: $artifact"
```

Then route the tagged messages to a dedicated file. With **rsyslog**, add `/etc/rsyslog.d/60-tuxcare-integrity.conf`:

```text
# Send everything tagged tuxcare-integrity to a dedicated log
:syslogtag, contains, "tuxcare-integrity"  /var/log/tuxcare-integrity.log
& stop
```

Reload rsyslog and, optionally, make the log append-only for auditing:

```text
systemctl restart rsyslog
touch /var/log/tuxcare-integrity.log
chmod 0640 /var/log/tuxcare-integrity.log
chattr +a /var/log/tuxcare-integrity.log   # append-only (optional)
```

On systems using **journald**, the `logger` tag is queryable without extra configuration:

```text
journalctl -t tuxcare-integrity
```

Run verification through this wrapper (or the equivalent step in your CI pipeline) before extracting or deploying any artifact. Every failed check is then captured in `/var/log/tuxcare-integrity.log` (or the journal), giving administrators a durable, reviewable record of integrity violations.

:::tip
Signatures for every application artifact follow the same model. If you need the signature repository path for a specific application, or the TuxCare public key, contact [sales@tuxcare.com](mailto:sales@tuxcare.com).
:::