# GitHub Issues Guide for AI Dev Agents

**Repo:** `lesash10/la-performance-lab`  
**Purpose:** Keep GitHub Issues and Milestones accurate, current, and useful as work happens.  
**Audience:** AI coding agents. Follow this guide at the start of every chat and after every meaningful unit of work.

---

## 1. Non-negotiable rules

1. **No silent work.** If you change code, docs, config, or product behavior, sync GitHub Issues in the same session.
2. **Search before create.** Never open a duplicate issue. Search open (and recently closed) issues first.
3. **One issue = one outcome.** An issue tracks a single shippable outcome with clear acceptance criteria—not a vague theme and not a dump of unrelated tasks.
4. **Update in place.** Prefer updating an existing issue over creating a new one for the same work.
5. **Milestones are real.** Every actionable issue belongs to an open milestone (or you create/update the milestone first).
6. **Close only when done.** Close an issue only when its acceptance criteria are met (or it is explicitly cancelled / duplicated). Always set a close reason.
7. **Leave a paper trail.** Progress, blockers, decisions, and links to PRs/commits go on the issue as comments—not only in chat.

If GitHub tools are unavailable, say so immediately and ask the human how to proceed. Do not pretend Issues were updated.

---

## 2. Session start checklist (do this first)

Before coding:

1. Confirm the active repo is `lesash10/la-performance-lab`.
2. List **open issues** and **open milestones**.
3. Identify which issue(s) this chat will advance. If the human named none, propose the best match or create one.
4. State in your first reply:
   - Issue number(s) you will work on
   - Milestone they belong to
   - What “done” means for this session
5. If no suitable issue exists for the requested work, **create it before** making product changes.

Do not start implementation until the tracking issue exists and is linked to a milestone.

---

## 3. When to create an issue

Create a new issue when **all** of the following are true:

- The work is real and will (or should) change the product, docs, infra, or process.
- No open issue already covers the same outcome.
- The outcome can be described with concrete acceptance criteria.

Also create an issue when you discover:

- A bug while doing other work
- Required follow-up that will not be finished in the current session
- Scope that was cut from the current issue (split it out; do not bury it)

Do **not** create issues for:

- Pure exploration / questions with no committed work
- Tiny one-line fixes that already belong to an open issue (comment + complete that issue instead)
- Duplicate restatements of existing open work

---

## 4. When to update an issue

Update (title, body, labels, milestone, assignees, and/or comments) when:

| Event | Required action |
|---|---|
| Work starts | Comment: what you are doing; move status toward In Progress if labels/project status exist |
| Scope changes | Edit body acceptance criteria; comment explaining the change |
| Partial progress | Comment with what shipped, what remains, blockers |
| PR opened | Comment with PR URL; reference `Fixes #N` / `Closes #N` in the PR when it fully completes the issue |
| PR merged / work done | Verify acceptance criteria → close issue with reason `completed` |
| Work cancelled | Close with reason `not_planned` and a short explanation |
| Duplicate found | Close with reason `duplicate` and point to the canonical issue |
| Blocked | Comment with blocker + owner; do not close |

---

## 5. Issue quality standard

Every issue must include:

### Title
- Imperative, specific, outcome-oriented
- Good: `Fix booking form day/time not included in submit payload`
- Bad: `Booking stuff` / `Updates` / `Fix bugs`

### Body (required sections)

```markdown
## Summary
One or two sentences: what and why.

## Acceptance criteria
- [ ] Concrete, testable criterion 1
- [ ] Concrete, testable criterion 2

## Notes
Context, constraints, links, screenshots, related issues.

## Out of scope
What this issue will not include.
```

### Labels (required set — apply when creating issues)

| Label | Use for |
|---|---|
| `enhancement` | New features or improvements |
| `bug` | Errors or broken functionality |
| `documentation` | Changes to README, guides, or code comments |
| `refactor` | Code cleanup without logic change |
| `urgent` | Blocks critical workflows |

Rules:
- Every issue gets exactly one type label: `enhancement`, `bug`, `documentation`, or `refactor`.
- Add `urgent` in addition when the work blocks critical workflows.
- Do not invent new labels. Keep labels few and accurate.

### Milestone
- Required for actionable work
- Name milestones by outcome or release slice, not by random dates alone
- Examples: `M1 — Trust & clarity`, `Launch readiness`, `Post-launch polish`
- If the right milestone does not exist, create it (title + short description + optional due date), then attach the issue

### Assignees
- Assign the human owner when known
- Otherwise leave unassigned and note ownership in a comment

---

## 6. Milestone rules

1. Milestones group issues into a coherent delivery slice.
2. Keep **one active “current” milestone** for near-term work when possible.
3. When all issues in a milestone are closed (or moved out), close the milestone.
4. If work slips, update the milestone description/due date and comment on affected issues—do not silently abandon it.
5. Do not park unrelated work under a milestone just to fill it.

When finishing a session, report milestone progress briefly:

- Open / closed issue counts for the active milestone
- Whether the milestone is still on track

---

## 7. Size and splitting

| Signal | Action |
|---|---|
| Issue will take multiple independent sessions with separate shippable outcomes | Split into multiple issues; optionally use a parent issue + sub-issues |
| Checklist items are unrelated | Split |
| Checklist items are steps of one outcome | Keep as one issue |
| You find extra work mid-flight | New issue for the extra work; finish or update the original |

A good default: an issue should be finishable in **one focused session** or a **single PR**.

---

## 8. Comments: what good looks like

Write short, factual comments. Prefer:

```markdown
## Progress
- Implemented X in `path/to/file`
- Still need Y

## Verification
- [x] Manual check: ...
- [ ] Pending: ...

## Links
- PR: <url>
- Commit: <sha or url>
```

Avoid:

- Chatty status with no facts
- Pasting huge logs without summary
- Updating only the human in chat while leaving the issue stale

---

## 9. Closing checklist

Before closing an issue as `completed`:

1. Every acceptance-criterion checkbox is done (or intentionally removed with a comment).
2. Related PR is merged, or the change is otherwise landed on the target branch.
3. No known regressions introduced by this work (or a follow-up issue exists).
4. Milestone still reflects reality.

Close reasons:

| Reason | When |
|---|---|
| `completed` | Acceptance criteria met |
| `not_planned` | Cancelled / won't do |
| `duplicate` | Same as another issue (link it) |

---

## 10. Linking code to issues

- Branch names: `issue-12-short-slug` or `feat/12-short-slug`
- Commits: mention `#12` when the commit clearly advances that issue
- PRs: use `Fixes #12` or `Closes #12` only when the PR fully completes the issue; otherwise use `Refs #12`
- After merge, verify the issue closed (or close it manually) and leave a final comment if needed

---

## 11. End-of-session checklist (do this before finishing)

1. Update issue body/checkboxes to match reality.
2. Add a progress or completion comment.
3. Close finished issues with the correct reason.
4. Create follow-up issues for unfinished or newly discovered work.
5. Confirm milestone assignment is still correct.
6. In your final reply to the human, list:
   - Issues created / updated / closed (with numbers + URLs)
   - Milestone status
   - Anything still open or blocked

---

## 12. Tooling

Prefer GitHub MCP tools when available:

- `list_issues` / `search_issues` — find existing work (search before create)
- `issue_read` — inspect a specific issue
- `issue_write` — create or update issues (title, body, labels, milestone, state, state_reason)
- `add_issue_comment` — progress, blockers, PR links
- `sub_issue_write` — parent/child breakdown when needed
- `list_issue_fields` / `list_issue_types` — only if the repo uses them

If MCP is down, use the GitHub UI or ask the human. Do not skip tracking.

Always operate on:

- **Owner:** `lesash10`
- **Repo:** `la-performance-lab`

---

## 13. Quick decision tree

```
Human asks for work
        │
        ▼
Search open issues for a match ──yes──► Update that issue, then work
        │
       no
        ▼
Create issue + attach milestone ──► Work ──► Comment progress
        │
        ▼
Acceptance criteria met?
   │            │
  yes           no
   │            │
Close as     Leave open + comment remaining work
completed    (+ follow-up issue if needed)
```

---

## 14. Minimal examples

### New feature issue title
`Add sticky mobile Book CTA after hero scroll`

### Bug issue title
`Instagram footer link points to generic instagram.com`

### Progress comment
`Implemented sticky CTA; hidden near #booking. Need mobile QA on iOS Safari before close.`

### Completion comment
`All acceptance criteria met. PR #18 merged to main. Closing.`

---

## 15. Reminder for agents

This file is operating procedure, not optional flavor text.

If you ship code without updating Issues/Milestones, you failed the process—even if the code is correct.

When in doubt: **create or update the issue first, then code.**
