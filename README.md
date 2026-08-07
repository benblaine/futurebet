# futurebet.lol

Landing page for [futurebet.lol](https://futurebet.lol) — a satirical art project about predatory gambling advertising in South Africa.

Static site, no build step and no dependencies. Vercel serves the files as-is.

| File | What it is |
| --- | --- |
| `index.html` | The page: markup plus the slot-machine and waitlist behaviour |
| `styles.css` | Compiled Tailwind utilities, the custom animations (marquee, glitch, neon glow), and the hand-written rules at the very bottom |
| `logo.webp` | The FutureBet.lol wordmark used as the hero heading, supplied pre-cut with an alpha channel |
| `poster.jpg` | Ad artwork, also the video poster and the social share image |
| `futurebet.mp4` | The "banned ad" video, muxed with `faststart` so it streams instead of downloading in full first |

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repo (`benblaine/futurebet`).
2. Leave every setting at its default — Framework Preset **Other**, no build command, no output directory. Deploy.
3. In **Settings → Domains**, add `futurebet.lol`. The domain was bought through Vercel, so it attaches instantly with no DNS changes.

Every push to the production branch redeploys automatically.

## Where the signups go

Signups land in the [FutureBet Waitlist sheet](https://docs.google.com/spreadsheets/d/1wIJGGbIodT6fryA3XKXi1zNu-s2tTz4aoeF6Ud899ik/edit) on benblaine@gmail.com, by way of a Google Form that writes into it. This is already wired up and needs no maintenance.

Visitors never see the form. The page posts to it in the background, so the slot machine, the reels and the "YOU'RE IN!" state all behave exactly as they look — nobody leaves futurebet.lol.

Two constants near the top of the `<script>` block in `index.html` point at the form:

```js
const WAITLIST_ENDPOINT = "https://docs.google.com/forms/d/e/<FORM_ID>/formResponse";
const WAITLIST_EMAIL_FIELD = "entry.<FIELD_ID>";
```

If the form is ever rebuilt, both IDs change. To re-derive them: open the form, three-dot menu → **Get pre-filled link**, type anything into the email field, **Get link**. The link contains the form ID and an `entry.<digits>=` parameter — those are the two values. Swap `/viewform` for `/formResponse` in the endpoint.

While `WAITLIST_ENDPOINT` is empty the form still validates and plays the full slot-machine animation, it just doesn't record anything — handy for testing the page without writing junk rows.

### Two things to know

**Failures are close to invisible.** Google Forms sends no CORS headers, so the request goes out as `no-cors` and the browser can't read the reply. Only a hard network error reaches the "SIGNUP JAMMED" state; an HTTP error from Google would still show "YOU'RE IN!". After changing anything about the form or the endpoint, verify by checking the sheet rather than trusting the page.

**Duplicates aren't filtered.** Someone signing up twice gets two rows. De-dupe when you export — a second tab with `=UNIQUE(Responses!B2:B)` does it.

This replaced an earlier Apps Script web app, which Google refused to authorise: the personal account hit "This app is blocked" with no override, and the Workspace account hid the "Anyone" access level the deployment needed. A Form needs no OAuth and nothing to authorise, at the cost of the two limitations above.

## Working on the page locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` directly with `file://` also mostly works, but the video won't load.

## Editing the design

The styling uses Tailwind utility class names, but `styles.css` is a pre-compiled stylesheet rather than a Tailwind build. Existing classes can be rearranged freely; a utility that isn't already in `styles.css` won't do anything — and it fails silently, so a made-up value like `max-w-[440px]` just gets ignored rather than erroring. Add a plain CSS rule for anything new, at the bottom of `styles.css` under the hand-written section. The palette is hot pink `#ff00ff`, acid green `#00ff88`, and yellow `#ffea00` on black.

The hero wordmark is an image (`logo.webp`) sized by the `.hero-logo` rule, so change its size there rather than with utility classes. Its neon halo is a CSS `drop-shadow`, not part of the file.

Its sparkle is CSS too. A light sweep runs across the letters — masked with `logo.webp` itself, so it lights up the wordmark rather than the box around it — followed by five star `<span>`s twinkling in a staggered cascade. Both share a 6s cycle: the sweep in the first third, the stars after. Replacing the logo means updating the mask in `.hero-logo-wrap::after` as well as the `<img>`, and the `.sparkle-N` positions are percentages tuned to the current letterforms. The whole effect is disabled under `prefers-reduced-motion`.
