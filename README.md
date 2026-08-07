# futurebet.lol

Landing page for [futurebet.lol](https://futurebet.lol) — bet on the future.

A single static `index.html`, no build step, no dependencies. Vercel serves it as-is.

## Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this GitHub repo (`benblaine/futurebet`).
2. Leave every setting at its default — Framework Preset: **Other**, no build command, no output directory. Deploy.
3. In the project's **Settings → Domains**, add `futurebet.lol`. Since the domain was bought through Vercel it attaches instantly — no DNS changes needed. Add `www.futurebet.lol` too and set it to redirect to the apex if you want.

Every push to the production branch redeploys automatically.

## Wiring up the waitlist

The email form currently falls back to opening a prefilled email to `hello@futurebet.lol`. To collect signups properly, create a form endpoint (e.g. [Formspree](https://formspree.io)) and paste its URL into the `FORM_ENDPOINT` constant at the bottom of `index.html`.
