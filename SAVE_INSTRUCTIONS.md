# Saving JSON Edits

Because this is a static no-backend project, the page cannot universally overwrite `data.json` in place.

## Reliable method

1. Open the JSON editor tab.
2. Edit JSON.
3. Click Validate.
4. Click Load into dashboard.
5. Click Download data.json.
6. Replace the old `data.json` file in the project folder.

## Direct save method

Some Chromium-based browsers support File System Access API.

If supported:
- click Save to chosen file
- choose `data.json`
- approve overwrite

If unsupported:
- use Download data.json

## Important

Edits loaded into the dashboard exist only in the current browser session until you download/save the updated JSON.
