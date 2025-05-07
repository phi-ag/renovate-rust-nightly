# Renovate Rust Nightly

[![Worker](https://img.shields.io/badge/worker-orange?style=for-the-badge)](https://renovate-rust-nightly.phi-ag.workers.dev/)

Parse nightly versions from [rust-lang.github.io](https://rust-lang.github.io/rustup-components-history/) and serve the result in the required JSON format for [Renovate Custom Datasources](https://docs.renovatebot.com/modules/datasource/custom/).

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    ":semanticCommits",
    "config:best-practices",
    "group:monorepos",
    "group:recommended"
  ],
  "customDatasources": {
    "rust-nightly": {
      "defaultRegistryUrlTemplate": "https://renovate-rust-nightly.phi-ag.workers.dev"
    }
  },
  "customManagers": [
    {
      "customType": "regex",
      "managerFilePatterns": ["rust-toolchain.toml"],
      "matchStrings": ["channel = \"nightly-(?<currentValue>[^\"]+)\""],
      "versioningTemplate": "regex:^(?<major>\\d{4})-(?<minor>\\d{2})-(?<patch>\\d{2})$",
      "datasourceTemplate": "custom.rust-nightly",
      "depNameTemplate": "rust-nightly"
    }
  ]
}
```
