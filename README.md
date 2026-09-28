# Digital Video Game Store

Playfield is a responsive PC game storefront built with React and Vite. Browse real Steam-listed games, search and filter by genre, inspect game details, and keep demo purchases in a local library.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create and preview a production build, run `npm run build` and `npm run preview`. Run `npm run lint` to check the source.

## Storefront behavior

- Search games by title, studio, or genre; filter the catalog by genre.
- Open any game to read a paraphrased store synopsis, developer, release information, and published PC requirements.
- Steam header artwork and catalog fields are a curated snapshot sourced from Steam's public app-details endpoint. Price snapshots are US-region values captured on Sep 28, 2026 and may change; open the linked Steam page for current pricing and availability.
- News headlines link to captured official Steam Community announcement posts. The list is a dated snapshot, not a live feed.
- Each game can only be added once. Demo checkout confirms locally and adds the game to browser storage; it does not purchase on Steam.
- Search switches to the full catalog outside the Library view; in Library it searches owned games only.
- Responsive navigation, catalog, game detail sheet, library cards, and cart drawer support mobile screens.

Steam's app-details endpoint does not allow direct browser requests from this site's origin, so catalog and news data are stored as local snapshots instead of being fetched live. Steam's official artwork URLs and typefaces load from the internet. No payment provider, Steam purchase, or live inventory/news integration is connected.