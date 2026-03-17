# SGA Dashboard

Static dashboard for GitHub Pages. It reads published Google Sheets CSV feeds for these tabs:

- `projects`
- `consultants`
- `financialHistory`
- `annualTaxSummary`

## What changed

This package includes support for the two finance tabs you just added:

- `financialHistory` with columns:
  - `year`
  - `quarter`
  - `grossRevenue`
  - `notes`
- `annualTaxSummary` with columns:
  - `year`
  - `ordinaryBusinessIncome`
  - `notes`

It also keeps the phase chart in this exact order:

- `SD`
- `DD`
- `CD`
- `BN`
- `CA`

## Before you upload

Open `config.js` and confirm the CSV URLs.

The consultants, financial history, and annual tax summary feeds are already filled in.

You still need to confirm the `projects` CSV URL in `config.js` if it is not already known:

```js
projects: ''
```

Paste the published CSV URL for the `projects` tab there.

## Deploy on GitHub Pages

1. Upload the files to your repository root.
2. Commit and push.
3. In GitHub, enable Pages for the branch.
4. Open the site URL.

## Notes

- Currency fields should stay numeric in the source sheets.
- `quarter` in `financialHistory` should be exactly `Q1`, `Q2`, `Q3`, or `Q4`.
- Loss years in `annualTaxSummary` should be negative numbers.
- The dashboard is intentionally tolerant of missing consultant fields. If the consultants sheet is still being built out, the page will still render.
