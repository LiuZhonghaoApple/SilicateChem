# SilicateChem Website Writing System

## 1. Purpose

This document defines the working system for maintaining and improving the SilicateChem B2B website.

The goal is not to let AI freely change the website.
The goal is to build a controlled, auditable, SEO-driven, conversion-focused writing and deployment system.

SilicateChem has already started receiving inquiries.
Therefore, all website changes must protect the current inquiry system first, then improve SEO and conversion step by step.

## 2. Tool Roles

### User

The user is the final decision maker.

Responsibilities:
- Define business priorities
- Approve or reject changes
- Confirm whether a task can move to the next step
- Decide whether a change can be deployed to production

### ChatGPT

ChatGPT is the strategist, planner, instruction writer, and reviewer.

Responsibilities:
- Translate business goals into Codex-ready instructions
- Break large goals into small auditable tasks
- Review Codex and terminal outputs
- Help decide the next action
- Protect scope boundaries
- Support SEO, B2B content, and inquiry conversion strategy

ChatGPT must not give large multi-step execution packages when the task requires result checking.

### Codex

Codex is the local execution employee.

Responsibilities:
- Execute one small approved task at a time
- Read or modify local files only when instructed
- Run terminal checks
- Report concise results
- Stop after each task and wait for confirmation

Codex must not expand the task scope.

### Cursor

Cursor is the local project workspace.

Responsibilities:
- Help inspect and edit the codebase
- Keep project context visible
- Support local development work

Cursor is not the final decision maker.

### Terminal

The terminal is the factual auditor.

Responsibilities:
- Confirm files exist
- Confirm git branch and status
- Run npm build
- Run URL checks
- Produce objective output for review

Terminal output should be pasted back to ChatGPT for review.

### GitHub

GitHub is the version control and recovery system.

Responsibilities:
- Store the source code
- Track commits
- Support branches
- Allow rollback
- Preserve project history

The main branch represents the current stable production state unless otherwise stated.

### Vercel

Vercel is the deployment system.

Responsibilities:
- Build and deploy the website
- Provide Preview deployments
- Manage Production environment variables
- Host the live website

Production deployment requires explicit user approval.

### Google Search Console

Google Search Console is the SEO measurement system.

Responsibilities:
- Confirm indexing
- Track impressions
- Track clicks
- Track CTR
- Track average position
- Provide query, page, country, and device data

GSC data should guide SEO actions.

## 3. Core Working Principle

All SilicateChem website work must follow this sequence:

Business goal or SEO data \
→ ChatGPT creates a small task \
→ User approves \
→ Codex executes one task \
→ Terminal verifies \
→ ChatGPT reviews result \
→ User confirms next step \
→ GitHub records changes \
→ Vercel Preview verifies \
→ Production only after approval \
→ GSC monitors results after release

## 4. Single-Step Execution Rule

When a task requires checking results:

- One instruction means one action.
- Codex must stop after the action.
- The result must be reviewed before the next action.

Maximum task size:
- One task should contain no more than three actions.
- If the result affects the next decision, the task must contain only one action.

## 5. One-Click Copy Rule

All operational instructions should be copy-ready.

ChatGPT should provide:
- Clear Codex instruction blocks
- Clear boundaries
- Clear output requirements

Codex should provide:
- Copy-ready terminal commands when needed
- Concise result summaries
- Generated file paths
- PASS / FAIL / BLOCKED status

## 6. Prohibited Actions Without Approval

Codex must not do the following unless explicitly approved:

- Modify production-related code
- Push to GitHub
- Deploy to Vercel
- Switch branches
- Restore removed images
- Modify environment variables
- Delete files
- Create a new business project
- Run broad SEO rewrites
- Change multiple pages at once
- Continue to the next task automatically

## 7. Website Content Change Workflow

For a new product page:

1. User provides product information.
2. ChatGPT creates a product page brief.
3. User approves the brief.
4. Codex updates only the required content files.
5. Terminal runs build.
6. GitHub records the change.
7. Vercel Preview is checked.
8. User approves Production deployment.

For a new blog post:

1. Topic comes from GSC data, inquiry questions, or product strategy.
2. ChatGPT creates a blog brief.
3. User approves.
4. Codex creates or updates the required content file.
5. Build is verified.
6. Preview is checked.
7. Production deployment requires approval.
8. GSC performance is reviewed after 7 to 28 days.

For SEO optimization:

1. Start from GSC data.
2. Choose one page or one keyword cluster.
3. Define one goal:
   - Improve CTR
   - Improve ranking
   - Improve inquiry conversion
   - Fix indexing issue
4. Make the smallest possible change.
5. Verify build.
6. Preview before Production.
7. Record the change.

## 8. Git and Deployment Rules

- main is the stable production branch.
- Do not directly change main without approval.
- Use a separate branch for each change when code changes are needed.
- Every meaningful website change should have a commit.
- Every deployment should be traceable.
- Production deployment requires explicit user approval.

## 9. SEO Monitoring Rules

SEO decisions should be based on:

- Google Search Console
- Sitemap status
- Robots status
- Canonical checks
- Indexing reports
- Search queries
- Page-level impressions
- CTR
- Average position
- Inquiry data

Do not optimize blindly.
