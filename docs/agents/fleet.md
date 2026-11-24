# Fleet settings

Every fleet in this project starts from these settings. The fleet skills read this file instead of naming any project's agents, commands or rules. Each value names its source; when a source changes, run the `setup` skill again (or edit the line by hand) so the two agree.

## Builder

One per ticket. It builds its ticket on its own branch, and never reviews or merges.

| Setting | Value | `room-cli thread spawn` flag |
| --- | --- | --- |
| Harness | Antigravity | `--provider antigravity` |
| Model | Gemini Neon | `--model gemini-4-neon` |
| Effort | Medium | `--reasoning-level medium` |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## Builder for small tickets

Tickets with an exact `polish`, `huntr` or `proposal` label use this table; every other ticket uses `## Builder`.

| Setting | Value | `room-cli thread spawn` flag |
| --- | --- | --- |
| Harness | Antigravity | `--provider antigravity` |
| Model | Gemini Neon | `--model gemini-4-neon` |
| Effort | Medium | `--reasoning-level medium` |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## Reviewer for Claude-built

One per pull request, from a different model family than the builder. It reviews the exact head and never edits. If it can't be started, the review waits: it is never swapped for another model.

| Setting | Value | `room-cli thread spawn` flag |
| --- | --- | --- |
| Harness | Codex | `--provider codex` |
| Model | Sol 6.1 | `--model gpt-6.1-sol` |
| Effort | Medium | `--reasoning-level medium` |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## Reviewer for GPT-built

Use the verified builder's provider, from its branch-matching `start checked` record and that exact thread's provider read. Unknown or conflicting family waits; existing reviewers retain their thread.

| Setting | Value | `room-cli thread spawn` flag |
| --- | --- | --- |
| Harness | Claude Code | `--provider claude-code` |
| Model | Opus 5.5 | `--model claude-opus-5-5` |
| Effort | High | `--reasoning-level high` |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## Reviewer for Gemini-built

Not in the 0.1.0 template (it maps only Claude-built and GPT-built). Gemini-built pull requests are reviewed by Codex.

| Setting | Value | `room-cli thread spawn` flag |
| --- | --- | --- |
| Harness | Codex | `--provider codex` |
| Model | Sol 6.1 | `--model gpt-6.1-sol` |
| Effort | Medium | `--reasoning-level medium` |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## Labels

The triage labels and their names here are in `triage-labels.md`. A fleet adds one label of its own:

| Label | Means | Put on by | Taken off by |
| --- | --- | --- | --- |
| `held` | The ticket is held: it waits for the user's approval of a changed plan or contract, and never starts while it has this label. It has no ready label while held | `to-tickets`, before it changes an approved plan; `launch-fleet`, when a merge changes a contract the ticket relies on | `to-tickets`, as it puts the ready label back once the new approval is recorded; `launch-fleet`'s `release` line, if it is still on after that |

The skill that holds a ticket first creates the label, once, with the description "Held: waits for the user's approval".

Source: the fleet skills, `to-tickets` and `launch-fleet`, which put it on and take it off. It is the same in every project.

## Test commands

The full set, in this order. A builder runs all of it locally, and opens its pull request only when every command passes. Node 22 or later.

| # | Folder | Command | CI check |
| --- | --- | --- | --- |
| 1 | root | `node --test` | `test` |

Source: [the CI workflow](../../.github/workflows/ci.yml).

## CI checks

| Check | Runs | Required on |
| --- | --- | --- |
| `test` | 1 | `main` |

The check runs on every pull request and push to `main`. There is no branch ruleset; the merge rule below requires it green.

Source: [the CI workflow](../../.github/workflows/ci.yml), and the branch rules (`gh api 'repos/{owner}/{repo}/rulesets'`: none).

## Standing merge rules

| Pull request | Review | Merged by, and when |
| --- | --- | --- |
| A ticket of an approved plan | Its other-family reviewer | launch-fleet, on the reviewer's `VERDICT: APPROVE` of that exact head with `test` green, the base unchanged and the merge read back |
| Specs, plans, releases, publishing | The user | The user |

Source: jparker2006, 2026-11-24: first-fleet defaults for this throwaway, given in the real-user e2e brief and the owner's 19:xxZ Claude stop (private record: jparker2006/ClosedWiz branch room/real-user-e2e-fresh-repo-to-first-merged-jrs9, private/evidence/real-user-e2e-2026-11-24/).

## GitHub identity

| Setting | Value |
| --- | --- |
| Record authors | `jparker2006` |

Source: no App (skipped: CloudRoom check unsupported here); `gh api user` reads `jparker2006`.
