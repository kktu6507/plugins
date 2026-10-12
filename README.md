# kktu's Claude Code plugin marketplace

This repository is only a marketplace catalog (`.claude-plugin/marketplace.json`). It contains no plugin code of its own — every listed plugin's source lives in its own public repository.

## Install

```text
/plugin marketplace add kktu6507/plugins
/plugin install ctide@kktu
```

## Plugins

| Plugin | Source repository |
| --- | --- |
| `ctide` (Cressetide) | [kktu6507/cressetide](https://github.com/kktu6507/cressetide) |

Each plugin's version is resolved from its own repository's `plugin.json`, not from this catalog, so a new release in the source repository is picked up automatically without any change here. This file only needs to change when a plugin is renamed, moved, or added.
