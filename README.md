SGA Dashboard - Modified Package

This package implements the three requested dashboard changes:

1. Adds Current Notes in red under the client name in Project Detail.
2. Adds estimatedDuration in parentheses next to Project Age when present.
3. Replaces the duplicate Financial metrics with:
   - Visible Contracts
   - Current Receivable
   - Future Receivable
   - Accounts Payable
   - Future Payable

What is already wired:
- All published CSV URLs you provided on March 30, 2026 have been inserted into src/feedConfig.js.
- The final URL you provided is preserved as supplementalFeed so it is not lost, even though this package does not use it yet.

Important:
- The URL mapping after projectsCore and projectsNotes is based on the order the links were provided.
- If one of the financial cards looks wrong after deployment, the package is structurally correct, but one or more of those feed assignments may need to be swapped.
