SGA Dashboard v3

This package preserves the working dashboard structure and adds the requested upgrades:
- Current Notes in Project Detail, fed by the published projects_notes sheet
- Estimated Duration shown beside Project Age when provided in projects_core
- Corrected Financial top metrics: Visible Contracts, Current Receivable, Future Receivable, Accounts Payable, Future Payable

Included:
- Projects tab
- Workload tab
- Financial tab
- Archive toggle
- Sort by job number / job name
- Billing health badge next to status
- Projects / financials / project notes / consultants / AR / AP / revenue history / tax summary wired live

Deploy:
1. Replace your repo root files with this package contents.
2. Keep package.json, vite.config.js, index.html, and src/ at repo root.
3. Commit to main.
4. Vercel auto-deploys.
