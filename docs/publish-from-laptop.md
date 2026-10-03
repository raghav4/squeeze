# Publish from your laptop

Prerequisites: Git, GitHub CLI (`gh`), and an authenticated GitHub account with permission to create `raghav4/squeeze`. Run `gh auth login` yourself if needed. Never put a token in source or a command copied into a public thread.

Unzip `squeeze-repo-with-history.zip`, then open a terminal in its `squeeze/` folder. It includes `.git` and six initial focused commits plus the design revision. If your unzip app hides dotfolders, it is fine as long as they are preserved.

Check your GitHub identity:

```sh
gh api user --jq .login
```

It must be `raghav4`. Do not continue under another account.

Create a new **public** repository and push the baseline and feature branch:

```sh
gh repo create raghav4/squeeze --public --source=. --remote=origin
git push -u origin main
git push -u origin 001-tab-parking
gh pr create --repo raghav4/squeeze --base main --head 001-tab-parking --title "feat: ship local-first Squeeze tab parking MVP" --body-file docs/pr-core.md
```

If the repository already exists, stop before `gh repo create`; check ownership and contents, then add its actual clone URL as the remote instead. Do not force push over existing work.

Open the resulting PR in a desktop browser. Upload the two screenshots from `docs/screenshots/full-app.png` and `docs/screenshots/popup.png` into the PR description so GitHub creates valid image attachment URLs. The draft description includes the summary, tests, caveats and footer.

Review or merge it:

```sh
gh pr view --repo raghav4/squeeze --web
gh pr merge --repo raghav4/squeeze --merge
```

`--merge` preserves the individual focused commits. This does not publish anything to the Chrome Web Store.
