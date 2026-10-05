// Content of the home page hub (HomeHub.vue).
// Internal links start with "/", external ones with "http" or "mailto:".

export type HomeLink = { text: string; link: string };

export type HomeProduct = {
    title: string;
    link: string;
    description: string;
    links?: HomeLink[];
};

export type HomeGroup = {
    title: string;
    products: HomeProduct[];
};

export const intro =
    "Live patching, end-of-life security fixes and long-term support for Linux and open source. Pick a task or a product to get started.";

export const tasks: (HomeLink & { product: string })[] = [
    { text: "Patch Linux kernels without rebooting", product: "KernelCare", link: "/live-patching-services/" },
    { text: "Keep an end-of-life Linux server patched", product: "ELS for Operating Systems", link: "/els-for-os/" },
    { text: "Stay on an end-of-life runtime", product: "ELS for Runtimes", link: "/els-for-runtimes/" },
    { text: "Patch end-of-life libraries in your build", product: "ELS for Language Ecosystems", link: "/els-for-libraries/" },
    { text: "Secure end-of-life databases and applications", product: "ELS for Applications", link: "/els-for-applications/" },
    { text: "Use signed, verified open-source packages", product: "SecureChain", link: "/securechain/" },
    { text: "Run AlmaLinux or Rocky Linux with long-term support and FIPS", product: "Enterprise Support", link: "/enterprise-support-for-almalinux/" },
    { text: "Prioritize vulnerabilities by real-world risk", product: "TuxCare Radar", link: "/radar/" },
    { text: "Manage live patching on-premises", product: "ePortal", link: "/eportal/" },
    { text: "Manage licenses and subscriptions", product: "Subscription Management Portal", link: "/tuxcare-cln/" },
];

export const groups: HomeGroup[] = [
    {
        title: "Live Patching",
        products: [
            {
                title: "KernelCare",
                link: "/live-patching-services/",
                description: "Rebootless security patches for Linux kernels and shared libraries.",
                links: [
                    { text: "Kernel live patching", link: "/live-patching-services/#kernelcare-kernel-live-patching" },
                    { text: "LibCare", link: "/live-patching-services/#libcare" },
                ],
            },
            {
                title: "KernelCare for IoT",
                link: "/kernelcare-for-iot/",
                description: "Live patching for ARM64 embedded and IoT devices.",
            },
            {
                title: "ePortal",
                link: "/eportal/",
                description: "On-premises console for managing KernelCare patches.",
                links: [
                    { text: "Installation", link: "/eportal/#installation" },
                    { text: "PatchSet deployment", link: "/eportal/#patchset-deployment" },
                ],
            },
            {
                title: "ePortal API",
                link: "/eportal-api/",
                description: "Automate ePortal from scripts and tooling.",
            },
        ],
    },
    {
        title: "Endless Lifecycle Support",
        products: [
            {
                title: "ELS overview",
                link: "/endless-lifecycle-support/",
                description: "How ELS is delivered and which product fits your case.",
            },
            {
                title: "ELS for Operating Systems",
                link: "/els-for-os/",
                description: "Security fixes for end-of-life Linux distributions.",
                links: [
                    { text: "Managing the repository", link: "/els-for-os/managing-els-repository/" },
                    { text: "Security data", link: "/els-for-os/machine-readable-security-data/" },
                ],
            },
            {
                title: "ELS for Runtimes",
                link: "/els-for-runtimes/",
                description: "PHP, Python, Node.js, Ruby, .NET and OpenJDK beyond end of life.",
                links: [
                    { text: "Security data", link: "/els-for-runtimes/machine-readable-security-data/" },
                ],
            },
            {
                title: "ELS for Language Ecosystems",
                link: "/els-for-libraries/",
                description: "Patched Java, JavaScript, Python, PHP and .NET packages.",
                links: [
                    { text: "Security data", link: "/els-for-libraries/machine-readable-security-data/" },
                ],
            },
            {
                title: "ELS for Applications",
                link: "/els-for-applications/",
                description: "Fixes for end-of-life MySQL, PostgreSQL, Tomcat and more.",
                links: [
                    { text: "Managing the repository", link: "/els-for-applications/managing-els-repository/" },
                    { text: "Security data", link: "/els-for-applications/machine-readable-security-data/" },
                ],
            },
        ],
    },
    {
        title: "Enterprise Linux",
        products: [
            {
                title: "TuxCare Enterprise Support",
                link: "/enterprise-support-for-almalinux/",
                description: "Vetted AlmaLinux and Rocky Linux updates with 16 years of coverage.",
                links: [
                    { text: "Extended Security Updates", link: "/enterprise-support-for-almalinux/#extended-security-updates" },
                    { text: "FIPS", link: "/enterprise-support-for-almalinux/fips/" },
                ],
            },
        ],
    },
    {
        title: "Supply Chain and Risk",
        products: [
            {
                title: "SecureChain for Open Source",
                link: "/securechain/",
                description: "Signed, verified packages from a TuxCare-managed registry.",
                links: [
                    { text: "JavaScript", link: "/securechain/javascript/" },
                    { text: "CLI", link: "/securechain/cli/" },
                ],
            },
            {
                title: "TuxCare Radar",
                link: "/radar/",
                description: "Vulnerability scanning that ranks findings by real-world risk.",
                links: [
                    { text: "Installation", link: "/radar/#installation" },
                    { text: "Usage", link: "/radar/#usage" },
                ],
            },
        ],
    },
    {
        title: "Account and Support",
        products: [
            {
                title: "Subscription Management Portal",
                link: "/tuxcare-cln/",
                description: "Manage license keys, subscriptions and billing.",
                links: [
                    { text: "Dashboard", link: "/tuxcare-cln/#dashboard" },
                    { text: "Billing", link: "/tuxcare-cln/#billing" },
                ],
            },
            {
                title: "Service Descriptions",
                link: "/service-descriptions/",
                description: "What Essential and Enhanced Support include.",
                links: [
                    { text: "Technical Account Manager", link: "/service-descriptions/tam/" },
                ],
            },
        ],
    },
];

export const resources: HomeLink[] = [
    { text: "CVE Tracker", link: "https://tuxcare.com/cve-tracker/" },
    { text: "Submit a support request", link: "https://www.tuxcare.com/support-portal/" },
    { text: "Contact sales", link: "mailto:sales@tuxcare.com" },
];
