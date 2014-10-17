---
layout: post
title: Purging Files from Git History
tags: [git, tips]
status: publish
type: post
published: true
meta:
  _edit_last: '1'
---

Over time, Git repositories can get filled up with files that do not belong in them. For example, files with sensitive data and large binary files. The steps below show you how to completely remove a file or directory from Git history. Keep in mind that these steps will **rewrite history** and will require everyone that has pulled your repository to rebase local changes. Make sure to let collaborators know ahead of time that you're about to rewrite the history of the repository.

The following steps will remove all instances of **path/to/target/from/repo/root** from the repository and its history using [git-filter-branch](http://git-scm.com/docs/git-filter-branch).  Git-filter-branch will remove all references to the path and cleanup any empty commits left over after the operation. Git-filter-branch will perform this operation over all tags and branches in the repository.  Once the history is clean, we will regenerate the reflog using [git-gc](http://git-scm.com/docs/git-gc). Finally, we push all our rewritten branches and tags to origin.

```
$ git filter-branch --force --index-filter 'git rm -r --cached --ignore-unmatch path/to/target/from/repo/root' --prune-empty --tag-name-filter cat -- --all
$ rm -Rf .git/refs/original
$ rm -Rf .git/logs
$ git gc --aggressive --prune=all
$ git push origin --force --all
$ git push origin --force --tags
```

A simpler alternative to using git-filter-branch manually is this tool: [BFG Repo Cleaner](http://rtyley.github.io/bfg-repo-cleaner/), check it out.

Once you have pushed your clean repository, other people will need to [rebase](http://git-scm.com/docs/git-rebase) their local changes. Someone that has local changes from the old master branch tip would do the following:

```
$ git fetch origin master
$ git rebase --onto origin/master master@{1}
```

References:

- [Git Internals - Maintenance and Data Recovery: Removing Objects](http://git-scm.com/book/en/Git-Internals-Maintenance-and-Data-Recovery#Removing-Objects)
- [Remove Sensitive Data](https://help.github.com/articles/remove-sensitive-data/)
- [Git Rebase - Recovering From Upstream Rebase](http://git-scm.com/docs/git-rebase#_recovering_from_upstream_rebase)