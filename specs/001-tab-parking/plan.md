# Implementation Plan: Squeeze
**Branch**: `001-tab-parking` | **Date**: 2026-10-03 | **Spec**: [spec.md](spec.md)

## Summary
TypeScript/React MV3 extension. The worker is the sole durable state writer. Interfaces send typed messages. Parking is snapshot -> storage write -> read-back -> live URL recheck -> close, with partial failures reported. UI uses local CSS, icons, restrained spring transitions.

## Technical Context
**Language/Version**: TypeScript 5, React 19, Chrome 116+.
**Dependencies**: Vite, esbuild, Lucide, Motion; no network runtime dependency.
**Storage**: chrome.storage.local versioned state and chrome.storage.session observed-tab cache.
**Testing**: Vitest API-fake safety tests and Playwright rendered UI/Chrome-extension integration.
**Platform**: Desktop Chrome MV3.
**Performance Goals**: Fast metadata-only batches, <100ms search for 1,000 records.
**Constraints**: No remote fetches/content scripts/AI; serial writes; verify persistence before closing.
**Scale**: 1,000 saved records initial validation; no unlimitedStorage permission.

## Constitution Check
Pass: local/no-AI architecture, write-before-close/read-back, incognito exclusion, undo, honest test evidence. UI previews are labeled fixtures and are not Chrome integration tests.

## Project Structure
src/background/index.ts: Chrome lifecycle and typed request handling.
src/lib/engine.ts: tested parking, reopening, storage state mutation.
src/lib/client.ts: typed request client and preview adapter.
src/types/index.ts: records and commands.
src/components/App.tsx: sidepanel, cards, palette, session/category flows.
src/main.tsx, src/popup.tsx: entry points.
public/manifest.json, public/icons/: Chrome metadata.
tests/: safety, restoration, performance, and UI checks.

## Complexity Tracking
No constitution violations. No content script because metadata alone meets MVP.
