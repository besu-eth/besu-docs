# Besu documentation

[Besu](https://github.com/besu-eth/besu/) is an open source Ethereum client developed
under the Apache 2.0 license and written in Java.
It runs on public and private networks.

This repository contains documentation for Besu, and is built using [Docusaurus](https://docusaurus.io/).
The doc site is hosted at [`docs.besu-eth.org`](https://docs.besu-eth.org).

If you're looking for the software source code, go to the [Besu software repository](https://github.com/besu-eth/besu).

### View older doc versions

See the Besu wiki for information about [viewing and hosting older versions of the documentation](https://lf-hyperledger.atlassian.net/wiki/display/BESU/View+older+documentation+versions)
on your own infrastructure.

### Contribute to the docs

**Important**: Add a [DCO sign-off](DCO.md) to each commit with `git commit -s` (or `git commit --signoff`).
The sign-off must use your legal name.
A commit without a sign-off fails the DCO check.

The following guidelines explain how to contribute to the
[Besu documentation repository](https://github.com/besu-eth/besu-docs).

#### Your first contribution

Start by looking for [issues](https://github.com/besu-eth/besu-docs/contribute) that have a
**good first issue** label.
Good first issues might require only a few lines of documentation, or have enough information
for a newcomer to easily document.

When you've identified an issue you want to work on, assign it to yourself, or message us on the
[Besu Discord](https://discord.com/invite/hyperledger) and we'll assign it to you.

#### Contribution workflow

The Besu documentation uses a [docs-as-code](https://www.writethedocs.org/guide/docs-as-code/)
approach, meaning documentation is created using the same tools as code.
The contribution workflow involves proposing changes by creating
[forks and pull requests (PRs)](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/about-collaborative-development-models#fork-and-pull-model)
on the documentation GitHub repository.
This facilitates open contributions, testing, and review.

To contribute changes:

1. [Fork](https://docs.github.com/en/get-started/quickstart/fork-a-repo) the Besu documentation
   repository.
2. [Clone](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
   your fork to your computer.

   ```bash
   git clone <FORKED-REPO>
   cd besu-docs
   ```

3. [Add an upstream remote](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-for-a-fork).

   ```bash
   git remote add upstream https://github.com/besu-eth/besu-docs.git
   ```

4. [Create and check out a topic branch](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging),
   naming it appropriately.
   Use the issue number and a short description, which is a reminder to fix only one issue in a PR.
   For example, `183-doc-cli-option`.

   ```bash
   git checkout -b <ISSUE-NUM>-<ISSUE-DESC>
   ```

5. Open the repository in a text editor (for example, [VS Code](https://code.visualstudio.com/))
   and edit the documentation in the `/docs` folder.
   Follow the [style guide](https://docs-template.consensys.com/contribute/style-guide) and
   [format your Markdown correctly](https://docs-template.consensys.com/contribute/format-markdown).
   If you delete, rename, or move a documentation file, add a
   [redirect](https://docs-template.consensys.com/create/configure-docusaurus#redirects) in
   `vercel.json`.
6. [Preview your changes locally](https://docs-template.consensys.com/contribute/preview) to check
   that they render correctly.

   ```bash
   npm start
   ```

7. Add and commit your changes, using a clear commit message.
   Include the [DCO sign-off](DCO.md) on every commit, or the DCO check fails.
   Push your changes to your remote fork (usually named `origin`).

   ```bash
   git add *
   git commit -s -m "<COMMIT-MESSAGE>"
   git push -u origin HEAD
   ```

8. Open a pull request against [besu-eth/besu-docs](https://github.com/besu-eth/besu-docs).
   Fill out the description according to the template.
   [Link the issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
   that the PR fixes in the description, for example `fixes #<ISSUE-NUM>`.
9. The bottom of the PR page displays checks that verify links, Markdown syntax, and more.
   If you have any errors, update your PR, repeating steps 5-7.
   If a spell check warning is for a real term this change introduces, add the term to
   `.github/vale/accept.txt`.
10. In the right sidebar of your PR, select the reviewers who should review your PR
    (typically the original issue raiser).
    If you don't know who to choose, or you can't because you're not a maintainer yet, select the
    reviewers listed by GitHub or keep the default value.
11. Make any required changes based on reviewer feedback, repeating steps 5-7.
12. After your PR is validated, all checks have passed, and your branch has no conflicts with the
    target branch, you can merge your PR.
    You can delete the topic branch after merging.

You can use a Git client such as [Fork](https://fork.dev/) instead of the command line.
The default branch is `main`.

#### Style guide

The Besu documentation is built using [Docusaurus](https://docusaurus.io/) and follows the
[Consensys documentation contribution guidelines](https://docs-template.consensys.com/contribute)
for these topics:

- [Style guide](https://docs-template.consensys.com/contribute/style-guide)
- [Format Markdown](https://docs-template.consensys.com/contribute/format-markdown)
- [Configure Docusaurus](https://docs-template.consensys.com/create/configure-docusaurus)
- [Add images](https://docs-template.consensys.com/contribute/add-images)
- [Preview the docs](https://docs-template.consensys.com/contribute/preview)
- [Review contributions](https://docs-template.consensys.com/contribute/review-contributions)

### Questions?

If you have questions about Besu, ask on the **besu** channel on [Discord](https://discord.com/invite/hyperledger).
