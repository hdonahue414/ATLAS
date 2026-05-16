# ATLAS Lightweight Verification

Run the static safety checks locally with:

```bash
node scripts/verify-atlas.mjs
```

The script is intentionally small and dependency-free. It checks:

- `data.json` parses and has a basic ATLAS data shape.
- `index.html` still contains the login gate and `unlock()` trigger.
- Referenced local JS/CSS assets exist.
- Referenced JavaScript files parse successfully.
- Inline scripts in `index.html` parse successfully.
- The auth surface still exposes the login button and Enter-key path.

This is not browser automation and not a replacement for manual review. GitHub Pages behavior, profile login, Tori modal behavior, JSON workflows, and visual presentation should still be checked manually after meaningful changes.
