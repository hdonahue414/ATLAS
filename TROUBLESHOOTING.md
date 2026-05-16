# ATLAS Troubleshooting

## If ATLAS is stuck on the loading screen

Older builds could get stuck when opened directly from your computer because browsers may block `fetch('data.json')` from `file://`.

v16 fixes this by embedding fallback data directly inside `index.html`.

## Usage

### Open directly
Open `index.html`. It should work from embedded data.

### GitHub Pages
Upload both `index.html` and `data.json`. When served over HTTP, ATLAS loads `data.json` first and uses embedded data only as fallback.

### Saving edits
Use the JSON editor tab, validate, then download a replacement `data.json`.
