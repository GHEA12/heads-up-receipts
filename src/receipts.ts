// Receipt feed loading for Heads-Up Receipts.
//
// The live feed is a static JSON file served next to the app (the vite dev
// server serves it from `public/receipts.json`). The same five receipts are
// bundled below as a fallback, so the glasses still show the demo if the
// fetch fails (offline, file missing, malformed JSON).

export interface Receipt {
  project: string
  verdict: string
  amount: string
  checkId: string
}

// Demo data drawn from our own projects: PayReceipt (Aevum), MarketReceipt
// MCP (CoinMarketCap), SettleSafe (Reactive). Clearly sample data; the real
// on-chain records live in those projects' own explorers and repos.
export const FALLBACK_RECEIPTS: Receipt[] = [
  {
    project: 'PayReceipt',
    verdict: 'PAID - CoP PASS',
    amount: '250 tUSD8 released',
    checkId: '0xcc0264..dd9c',
  },
  {
    project: 'PayReceipt',
    verdict: 'BLOCKED - REFUNDED',
    amount: '250 tUSD8 held back',
    checkId: 'CoP name/address mismatch',
  },
  {
    project: 'MarketReceipt',
    verdict: 'ANSWERED - VERIFIED',
    amount: 'BTC/USD quote + receipt',
    checkId: 'sha256 chain #0042',
  },
  {
    project: 'SettleSafe',
    verdict: 'RELEASED - DELIVERED',
    amount: '0.01 ETH to seller',
    checkId: '0x56c9c9..3fe19',
  },
  {
    project: 'SettleSafe',
    verdict: 'REFUNDED - TIMEOUT',
    amount: '0.01 ETH to buyer',
    checkId: '0xeb7a29..69834',
  },
]

function isReceipt(value: unknown): value is Receipt {
  if (typeof value !== 'object' || value === null) return false
  const r = value as Record<string, unknown>
  return (
    typeof r.project === 'string' &&
    typeof r.verdict === 'string' &&
    typeof r.amount === 'string' &&
    typeof r.checkId === 'string'
  )
}

export async function loadReceipts(feedUrl = 'receipts.json'): Promise<Receipt[]> {
  try {
    const response = await fetch(feedUrl)
    if (!response.ok) throw new Error(`feed HTTP ${response.status}`)
    const data: unknown = await response.json()
    const list = (data as { receipts?: unknown })?.receipts
    if (Array.isArray(list) && list.length > 0 && list.every(isReceipt)) {
      return list
    }
    throw new Error('feed has no usable receipts')
  } catch (error) {
    console.log('Receipt feed unavailable, using bundled demo data:', error)
    return FALLBACK_RECEIPTS
  }
}

// One screen of text: a header line with the position, then the receipt's
// three lines (verdict, amount, check id), then the input hint.
export function formatReceipt(receipts: Receipt[], index: number): string {
  const receipt = receipts[index]
  return [
    `Receipt ${index + 1}/${receipts.length} - ${receipt.project}`,
    receipt.verdict,
    receipt.amount,
    `Check ${receipt.checkId}`,
    'Tap for next - double-tap to exit.',
  ].join('\n')
}
