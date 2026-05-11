const lightCodeTheme = require("prism-react-renderer").themes.github;
const darkCodeTheme = require("prism-react-renderer").themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Besu documentation",
  url: "https://besu.hyperledger.org",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.svg",
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "hyperledger", // Usually your GitHub org/user name.
  projectName: "besu-docs", // Usually your repo name.
  deploymentBranch: "gh-pages", // Github Pages deploying branch

  // Even if you don't use internationalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          breadcrumbs: true,
          sidebarPath: require.resolve("./sidebars.js"),
          // Set a base path separate from default /docs
          editUrl: "https://github.com/hyperledger/besu-docs/tree/main/",
          path: "./docs",
          routeBasePath: "/",
          // @ts-ignore
          // eslint-disable-next-line global-require
          include: ["**/*.md", "**/*.mdx"],
          exclude: [
            "**/_*.{js,jsx,ts,tsx,md,mdx}",
            "**/_*/**",
            "**/*.test.{js,jsx,ts,tsx}",
            "**/__tests__/**",
          ],
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
          includeCurrentVersion: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // announcementBar: {
      //   id: "announcement_bar",
      //   content: "⛔️ This documentation site is still under construction! 🚧",
      //   backgroundColor: "#fafbfc",
      //   textColor: "#091E42",
      //   isCloseable: false,
      // },
      colorMode: {
        defaultMode: "light",
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 5,
      },
      docs: {
        sidebar: {
          hideable: true,
          autoCollapseCategories: true,
        },
      },
      navbar: {
        logo: {
          alt: "Besu",
          src: "img/logo-reversed.svg",
          srcDark: "img/logo-reversed.svg",
          width: 100,
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "publicDocSidebar",
            docId: "index",
            position: "left",
            label: "Public networks",
          },
          {
            type: "docSidebar",
            sidebarId: "privateDocSidebar",
            docId: "index",
            position: "left",
            label: "Private networks",
          },
          {
            href: "https://github.com/hyperledger/besu/",
            className: "header-github-link",
            position: "right",
          },
          {
            href: "https://discord.gg/hyperledger",
            className: "header-discord-link",
            position: "right",
          },
          {
            href: "https://twitter.com/HyperledgerBesu",
            className: "header-twitter-link",
            position: "right",
          },
        ],
      },
      footer: {
        copyright:
          "Besu and its documentation are licensed under the Apache 2.0 license.",
        logo: {
          alt: "Besu logo",
          src: "img/logo.svg",
          srcDark: "img/logo-reversed.svg",
          href: "https://www.hyperledger.org/use/besu",
          width: 250,
        },
        links: [
          {
            title: "Public networks",
            items: [
              {
                label: "Introduction",
                to: "/public-networks",
              },
              {
                label: "How to guides",
                to: "/public-networks/how-to",
              },
              {
                label: "Concepts",
                to: "/public-networks/concepts",
              },
              {
                label: "Tutorials",
                to: "/public-networks/tutorials",
              },
              {
                label: "Reference",
                to: "/public-networks/reference",
              },
            ],
          },
          {
            title: "Private networks",
            items: [
              {
                label: "Introduction",
                to: "/private-networks",
              },
              {
                label: "How to guides",
                to: "/private-networks/how-to",
              },
              {
                label: "Concepts",
                to: "/private-networks/concepts",
              },
              {
                label: "Tutorials",
                to: "/private-networks/tutorials",
              },
              {
                label: "Reference",
                to: "/private-networks/reference",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/hyperledger",
              },
              {
                label: "Besu Wiki",
                href: "https://lf-hyperledger.atlassian.net/wiki/spaces/BESU/overview",
              },
              {
                label: "Besu Twitter",
                href: "https://twitter.com/HyperledgerBesu",
              },
              {
                label: "Besu GitHub",
                href: "https://github.com/hyperledger/besu/",
              },
              {
                label: "Besu documentation GitHub",
                href: "https://github.com/hyperledger/besu-docs",
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["solidity", "toml", "java", "bash"],
      },
      mermaid: {
        options: {
          fontFamily: "arial, verdana, sans-serif;",
          wrap: true,
          sequence: {
            diagramMarginX: 25,
            diagramMarginY: 25,
          },
          flowchart: {
            diagramPadding: 5,
            nodeSpacing: 75,
          },
        },
      },
      zoom: {
        selectors: [
          "div.docusaurus-mermaid-container",
          "div.mermaid[data-processed=\"true\"]",
          ".theme-doc-markdown img",
          ".drawio",
        ],
        toolbar: {
          enabled: true,
        },
      },
      languageTabs: [
        {
          highlight: "bash",
          language: "curl",
          logoClass: "bash",
        },
        {
          highlight: "python",
          language: "python",
          logoClass: "python",
        },
        {
          highlight: "go",
          language: "go",
          logoClass: "go",
        },
        {
          highlight: "javascript",
          language: "nodejs",
          logoClass: "nodejs",
        },
      ],
    }),
  plugins: [
    [
      "@docusaurus/plugin-google-gtag",
      {
        trackingID: "G-KD07N5GM2B",
        anonymizeIP: true,
      },
    ],
    [
      "@docusaurus/plugin-google-tag-manager",
      {
        containerId: "GTM-THG37T4",
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        redirects: [
          {
            from: "/public-networks/concepts/the-merge",
            to: "/public-networks/concepts/node-clients",
          },
          {
            from: ["/public-networks/how-to/configuration-file", "/public-networks/how-to/use-configuration-file"],
            to: "/public-networks/how-to/configure-besu",
          },
          {
            from: ["/private-networks/tutorials/permissioning/onchain", "/private-networks/tutorials/permissioning/upgrade-contracts", "/private-networks/how-to/use-permissioning/onchain", "/private-networks/concepts/permissioning/onchain"],
            to: "/private-networks/concepts/permissioning",
          },
          {
            from: "/private-networks/how-to/use-permissioning/local",
            to: "/private-networks/how-to/use-local-permissioning",
          },
          {
            from: ["/private-networks/how-to/use-privacy/eea-compliant", "/private-networks/how-to/use-privacy/besu-extended", "/private-networks/how-to/use-privacy/tessera", "/private-networks/how-to/use-privacy/privacy-groups", "/private-networks/how-to/use-privacy/flexible", "/private-networks/how-to/use-privacy/access-private-transactions", "/private-networks/how-to/use-privacy/sign-pmts", "/private-networks/how-to/use-privacy/web3js-quorum", "/private-networks/how-to/use-privacy/performance-best-practices", "/private-networks/concepts/privacy", "/private-networks/concepts/privacy/private-transactions", "/private-networks/concepts/privacy/private-transactions/processing", "/private-networks/concepts/privacy/privacy-groups", "/private-networks/concepts/privacy/flexible-privacy", "/private-networks/concepts/privacy/multi-tenancy", "/private-networks/concepts/privacy/plugin"],
            to: "/private-networks",
          },
          {
            from: "/private-networks/how-to/monitor/quorum-hibernate",
            to: "/private-networks/how-to/monitor",
          },
          {
            from: ["/private-networks/tutorials/privacy", "/private-networks/tutorials/privacy/multi-tenancy", "/private-networks/tutorials/privacy/web3js-quorum","/private-networks/tutorials/privacy/quickstart"],
            to: "/private-networks/tutorials",
          },
          {
            from: "/private-networks/tutorials/kubernetes/nat-manager",
            to: "/private-networks/tutorials/kubernetes",
          },
          {
            from: ["/private-networks/how-to/configure/tls/client-and-server", "/private-networks/concepts/pki", "/private-networks/how-to/configure/tls/p2p"],
            to: "/private-networks/how-to/configure/tls",
          },
          {
            from: ["/private-networks/how-to/send-transactions/private-transactions", "/private-networks/how-to/send-transactions/concurrent-private-transactions"],
            to: "/public-networks/how-to/send-transactions",
          },
          {
            from: "/private-networks/concepts/plugins",
            to: "/public-networks/concepts/plugins",
          },
          {
            from: "/private-networks/reference/plugin-api-interfaces",
            to: "/public-networks/reference/plugin-api-interfaces",
          },
          {
            from: "/private-networks/reference/api/objects",
            to: "/public-networks/reference/api",
          }
        ],
      },
    ],
    [
      "docusaurus-plugin-llms",
      {
        docsDir: "docs",
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        title: "Besu documentation",
        description:
          "Official Besu documentation: public Ethereum networks, permissioned / private networks, APIs, configuration, and operations.",
        excludeImports: true,
        removeDuplicateHeadings: true,
        logLevel: process.env.CI ? "quiet" : "normal",
        ignoreFiles: ["assets/**"],
        includeOrder: [
          "public-networks/**/*",
          "private-networks/**/*",
          "global/**/*",
        ],
      },
    ],
    "@r74tech/docusaurus-plugin-panzoom",
  ],
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        docsRouteBasePath: "/",
        hashed: true,
        indexBlog: false,
        askAi: {
          project: "besu",                 
          apiUrl: process.env.ASK_AI_API_URL || "http://localhost:5000/api/stream?api_key=....",
          hotkey: "cmd+k",
          texts: {
            welcomeMessage:
              "Hi! I can answer questions about the documentation, its features or usage instructions. Be sure to check the source documentation links that I provide for full details.\n\n" +
              "Please do not input any of your own or another's personal information i.e, passwords, private keys, seed phrases, personal data, or other sensitive information. If you need support and do not want to engage with me, please reach out to us via Discord. Any information that you provide is not used for training my AI systems. For details on our data handling practices, see our Privacy Policy.\n\n" +
              "By proceeding you acknowledge the above.",
            inputPlaceholder: "Please ask a question",
          }              
        },        
      },
    ],
    "@docusaurus/theme-mermaid",
  ],
};

module.exports = config;
