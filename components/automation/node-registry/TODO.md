# Node Palette / Node Registry Implementation Plan

## Step 1 — Create Node Registry core
- [x] Add `components/automation/node-registry/types.ts` with strict metadata/config schema types.
- [x] Add `components/automation/node-registry/registry.ts` registry API (categories, lookup, indexing).
- [x] Add `components/automation/node-registry/index.ts` barrel exports.


## Step 2 — Bridge existing ETL registry
- [ ] Add adapter to transform `ETL_NODE_REGISTRY` + `ETL_CATEGORIES` into new registry types.
- [ ] Ensure backward compatibility with existing `configSchema` shapes.

## Step 3 — Implement Node Palette UI
- [ ] Add `components/automation/NodePalette/` components (search, category list, favorites/recent).
- [ ] Add collapsible docked layout suitable for `@xyflow/react` panels.
- [ ] Implement rich hover preview + documentation/example links.

## Step 4 — Drag & drop integration with XYFlow
- [ ] Add drag payload helpers (node id + template/custom config).
- [ ] Implement `onDragOver` + `onDrop` handlers using `dragUtils.getDropPosition()`.
- [ ] Add placement preview and valid drop highlighting.

## Step 5 — Templates + persistence
- [ ] Add template save/load (localStorage) and template insertion via drag.
- [ ] Provide template previews.

## Step 6 — Smart ranking + intelligence
- [ ] Implement fuzzy scoring + suggestions (related nodes).
- [ ] Rank by favorites/recents.

## Step 7 — Performance hardening
- [ ] Add memoization for computed search results and hover previews.
- [ ] Virtualize long lists if needed.

## Step 8 — Tests & docs
- [ ] Add unit tests for fuzzy scoring + registry indexing.
- [ ] Add lightweight integration test for drop payload -> node placement.
- [ ] Update docs under `components/automation/node-registry/README.md`.

