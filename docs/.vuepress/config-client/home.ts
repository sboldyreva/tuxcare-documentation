// Content of the home page hub (HomeHub.vue).
// Internal links start with "/", external ones with "http" or "mailto:".

export type HomeLink = { text: string; link: string };

export type HomeProduct = {
    task: string;
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
    "Live patching, end-of-life security fixes and long-term support for Linux and open source. Find your task below to get to the right product.";

export const groups: HomeGroup[] = [
    {
        title: "Live Patching",
        products: [
            {
                task: "Patch Linux kernels without rebooting",
                title: "KernelCare",
                link: "/live-patching-services/",
                description: "Security patches and bugfixes for popular Linux kernels, installed without rebooting.",
                links: [
                    { text: "Kernel live patching", link: "/live-patching-services/#kernelcare-kernel-live-patching" },
                    { text: "LibCare", link: "/live-patching-services/#libcare" },
                ],
            },
            {
                task: "Patch IoT and embedded devices live",
                title: "KernelCare for IoT",
                link: "/kernelcare-for-iot/",
                description: "Live security patching for ARM64-based embedded systems, for enterprise IoT users and OEMs.",
            },
            {
                task: "Manage live patching on-premises",
                title: "ePortal",
                link: "/eportal/",
                description: "The web management console for KernelCare Enterprise live patch management.",
                links: [
                    { text: "Installation", link: "/eportal/#installation" },
                    { text: "PatchSet deployment", link: "/eportal/#patchset-deployment" },
                ],
            },
            {
                task: "Automate ePortal",
                title: "ePortal API",
                link: "/eportal-api/",
                description: "A complete API for everyday use.",
            },
        ],
    },
    {
        title: "Endless Lifecycle Support",
        products: [
            {
                task: "Find the right ELS product",
                title: "ELS overview",
                link: "/endless-lifecycle-support/",
                description: "How ELS is delivered and which product fits your case.",
            },
            {
                task: "Keep an end-of-life Linux server patched",
                title: "ELS for Operating Systems",
                link: "/els-for-os/",
                description: "Continue running your Linux server after the operating system’s end of life.",
                links: [
                    { text: "Managing the repository", link: "/els-for-os/managing-els-repository/" },
                    { text: "Security data", link: "/els-for-os/machine-readable-security-data/" },
                ],
            },
            {
                task: "Stay on an end-of-life runtime",
                title: "ELS for Runtimes",
                link: "/els-for-runtimes/",
                description: "Security fixes for language runtimes beyond their official end-of-life date.",
                links: [
                    { text: "Security data", link: "/els-for-runtimes/machine-readable-security-data/" },
                ],
            },
            {
                task: "Patch end-of-life libraries in your build",
                title: "ELS for Language Ecosystems",
                link: "/els-for-libraries/",
                description: "Security fixes for open-source packages across language ecosystems beyond their official end-of-life date.",
                links: [
                    { text: "Security data", link: "/els-for-libraries/machine-readable-security-data/" },
                ],
            },
            {
                task: "Secure end-of-life databases and applications",
                title: "ELS for Applications",
                link: "/els-for-applications/",
                description: "Security fixes for open-source applications after official support ends.",
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
                task: "Run AlmaLinux or Rocky Linux with long-term support and FIPS",
                title: "TuxCare Enterprise Support",
                link: "/enterprise-support-for-almalinux/",
                description: "TuxCare-vetted AlmaLinux and Rocky Linux updates with 16 years of coverage, FIPS-compliant patches and pay-as-you-go support.",
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
                task: "Use signed, verified open-source packages",
                title: "SecureChain for Open Source",
                link: "/securechain/",
                description: "Verified, signed, continuously patched open-source packages from a TuxCare-managed registry. JavaScript at launch; Python, Java, Go and PHP on the roadmap.",
                links: [
                    { text: "JavaScript", link: "/securechain/javascript/" },
                    { text: "CLI", link: "/securechain/cli/" },
                ],
            },
            {
                task: "Prioritize vulnerabilities by real-world risk",
                title: "TuxCare Radar",
                link: "/radar/",
                description: "Reveals the real-world risk vulnerabilities pose, instead of relying on conventional scoring.",
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
                task: "Manage licenses and subscriptions",
                title: "Subscription Management Portal",
                link: "/tuxcare-cln/",
                description: "Manage your TuxCare licenses and services in one user-friendly interface.",
                links: [
                    { text: "Dashboard", link: "/tuxcare-cln/#dashboard" },
                    { text: "Billing", link: "/tuxcare-cln/#billing" },
                ],
            },
            {
                task: "Check what technical support includes",
                title: "Service Descriptions",
                link: "/service-descriptions/",
                description: "Technical support service descriptions.",
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
