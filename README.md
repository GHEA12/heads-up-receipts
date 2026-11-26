# Heads-Up Receipts

An Even G2 glasses app that shows verification receipts from an AI
agent's work, one glance at a time.

Agents that pay invoices, settle escrows, or answer questions with
proof all produce receipts, but those receipts usually sit in a
dashboard nobody opens. Heads-Up Receipts puts the latest ones on the
glasses display instead: three short lines per receipt, readable in a
second, no phone in hand.

## What it shows

Each receipt takes one screen:

- A header line with the position and project, such as `Receipt 2/5 - PayReceipt`
- The verdict, such as `PAID - CoP PASS` or `BLOCKED - REFUNDED`
- The amount, such as `250 tUSD8 released`
- The check id, a transaction hash or receipt reference

The demo feed carries five receipts drawn from our own projects
(PayReceipt, MarketReceipt, SettleSafe). They are sample data, labelled
as a demo feed in the feed file itself. The app is read-only and never
moves money.

## How it works

The app is one full-screen text container built on the official Even
Hub minimal template, using the Even Hub SDK (0.0.10) with TypeScript
and Vite.

- A single tap cycles to the next receipt, wrapping back to the first
  after the last one.
- A double-tap exits the app.
- At startup the companion fetches a small JSON feed. If the fetch
  fails, the same receipts bundled in the app are shown instead, so the
  display never comes up empty.

## Run it in the simulator

```bash
npm install
npm run dev        # vite dev server on http://localhost:5173
npm run simulate   # opens the Even Hub simulator against the dev server
```

The simulator is free and needs no account, wallet, or API key. On real
glasses, serve the app on a reachable URL and load it through the Even
Hub companion app.

## The data feed

The vite dev server serves `public/receipts.json` at `/receipts.json`.
The format is one object with a `receipts` array; each receipt has four
string fields:

```json
{
  "feed": "Heads-Up Receipts demo feed",
  "receipts": [
    {
      "project": "PayReceipt",
      "verdict": "PAID - CoP PASS",
      "amount": "250 tUSD8 released",
      "checkId": "0xcc0264..dd9c"
    }
  ]
}
```

Point the app at a live feed by replacing that file (or the fetch URL
in `src/receipts.ts`) with a feed your own agent publishes. Keep the
bundled fallback in `src/receipts.ts` in sync if the demo data changes.

## Files

| File | Purpose |
|---|---|
| `src/main.ts` | Bridge setup, page container, tap and double-tap handling. |
| `src/receipts.ts` | Feed loading with validation, bundled fallback data, screen formatting. |
| `public/receipts.json` | The demo receipt feed served next to the app. |
| `app.json` | Even Hub manifest. No permissions requested. |
| `index.html` | Companion WebView host page. |
