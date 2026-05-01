---
title: Import ERA1 files
sidebar_position: 9
description: Import pre-merge Ethereum history from ERA1 archive files when using Full sync
---

When running [full sync](../concepts/node-sync.md#full-synchronization), node operators can optionally
import [pre-merge](https://ethereum.org/en/roadmap/merge/) block history from locally stored or remote ERA1 archive files. This method allows
nodes to bootstrap pre-merge Ethereum data without relying on peer-to-peer downloads.

ERA1 file import must be explicitly enabled by including the following command line options:

```bash
besu --era1-import-prepipeline-enabled --era1-data-uri=<PATH-OR-URI> --era1-import-prepipeline-concurrency=1
```

In the command:

- [`--era1-import-prepipeline-enabled`](../reference/cli/options.md#era1-import-prepipeline-enabled)
    enables importing pre-merge blocks from ERA1 archive files before full synchronization begins.
    This option only applies in `FULL` sync mode.
- [`--era1-data-uri`](../reference/cli/options.md#era1-data-uri) specifies the location of the ERA1
    files to be imported. Either a simple filesystem path (`/path/to/files/`), or an HTTP address
    (`https://mainnet.era1.nimbus.team`). The default is
    `https://mainnet.era1.nimbus.team`.
- [`--era1-import-prepipeline-concurrency`](../reference/cli/options.md#era1-import-prepipeline-concurrency)
    sets the number of parallel processes used to import ERA1 files. The default is `1`.
    Increase only if you encounter slow file download speeds and your system can handle additional load.

After all ERA1 files are imported, Besu automatically continues with full synchronization to complete
syncing the rest of the chain.