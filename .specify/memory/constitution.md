# Squeeze Constitution

## Core Principles
### I. Preserve before close
A tab must never be closed until its complete saved record has been persisted and read back. Save failures leave original tabs open. Reopen never deletes the parked record.
### II. Local, deterministic, private
No backend, account, network service, analytics, AI, page scraping, or automatic deletion. Browser metadata is sufficient. Incognito data is excluded. Every organization choice is explicit or domain-based.
### III. Calm, reversible UX
The primary surface is a polished full app in a Chrome tab; Side Panel is optional. Purple is restrained. Keyboard focus, readable labels, reduced motion, and honest error states are required. Destructive saved-record removal offers undo.
### IV. Tests before trust
Storage failures, partial closes, concurrent requests, navigation races, and restart persistence must be tested. Real Chrome integration checks are separate from browser previews and API mocks.
### V. Focused delivery
Deliver core parking before advanced features. Keep requirements, plan, tasks, and convergence findings current. Use small reviewed changes; no secret or private user data in source/history.

## Quality Gates
Type checking, automated tests, production build, privacy review, and rendered UI inspection must pass before calling a build ready for user testing. Browser state restoration is best effort; form contents and scroll positions are not saved.

## Governance
Amendments require a documented rationale and a version bump. Each change is checked against these principles and its feature specification. Violations must be fixed or explicitly accepted before release.

**Version**: 1.1.0 | **Ratified**: 2026-10-03 | **Last Amended**: 2026-10-03
