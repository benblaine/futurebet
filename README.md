# futurebet.lol

Landing page for [futurebet.lol](https://futurebet.lol) — a satirical art project about predatory gambling advertising in South Africa.

Static site, no build step and no dependencies. Vercel serves the files as-is.

| File | What it is |
| --- | --- |
| `index.html` | The page: markup plus the slot-machine and waitlist behaviour |
| `styles.css` | Compiled Tailwind utilities plus the custom animations (marquee, glitch, neon glow) |
| `poster.jpg` | Hero and video poster artwork |
| `futurebetvideo_compressed.mp4` | The "banned ad" video |
| `google-apps-script.gs` | Backend for the waitlist — runs on Google, not here |

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repo (`benblaine/futurebet`).
2. Leave every setting at its default — Framework Preset **Other**, no build command, no output directory. Deploy.
3. In **Settings → Domains**, add `futurebet.lol`. The domain was bought through Vercel, so it attaches instantly with no DNS changes.

Every push to the production branch redeploys automatically.

## Saving signups to a Google Sheet

The email form works the moment the page is live, but until you finish these steps the addresses aren't stored anywhere. Roughly five minutes:

1. Open the [FutureBet Waitlist sheet](https://docs.google.com/spreadsheets/d/11_iJU0GDE6xX4MIBH0zjNbjgwgSjvfSK98u9h69xsik/edit). (Starting over? Any new sheet from [sheets.new](https://sheets.new) works the same way.)
2. In that sheet choose **Extensions → Apps Script**. Delete the placeholder code.
3. Paste in the entire contents of `google-apps-script.gs` from this repo and save.
4. Click **Deploy → New deployment**. Pick type **Web app**, then set:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**

   "Anyone" is what lets the landing page post to it. The script only ever appends a row, so this doesn't expose the sheet itself.
5. Authorise the script when Google prompts. It warns that the app isn't verified — choose **Advanced → Go to (project name)** and allow it. This is normal for your own scripts.
6. Copy the Web app URL. It looks like `https://script.google.com/macros/s/AKfyc.../exec`.
7. In `index.html`, paste that URL into the `SHEET_ENDPOINT` constant near the top of the `<script>` block:

   ```js
   const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfyc.../exec";
   ```

8. Commit and push. Vercel redeploys, and signups start landing in a **Signups** tab with timestamp, email, and source.

The script creates the tab and its header row on the first signup, and skips addresses that are already on the list. If you edit the Apps Script later, deploy it again with **Deploy → Manage deployments → Edit → New version**, otherwise the old code keeps running.

While `SHEET_ENDPOINT` is empty the form still validates and plays the full slot-machine animation, it just doesn't record anything — handy for testing the page without writing junk rows.

## Working on the page locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly with `file://` also mostly works, but the video won't load.

## Editing the design

The styling uses Tailwind utility class names, but `styles.css` is a pre-compiled stylesheet rather than a Tailwind build. Existing classes can be rearranged freely; a utility that isn't already in `styles.css` won't do anything, so add a plain CSS rule for anything new. The palette is hot pink `#ff00ff`, acid green `#00ff88`, and yellow `#ffea00` on black.
