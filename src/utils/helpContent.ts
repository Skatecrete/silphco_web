export const HELP_CONTENT = {
  spawns: {
    title: "🔥 Spawns Help",
    content: `🔥 SPAWNS HELP 🔥

───────────────────
🦊 LIST OF CURRENT WILD SPAWNS
───────────────────
• Pokémon currently spawning in the wild
• Spawn rate shows how common they are

───────────────────
📈 SPAWN RATES:
───────────────────
💪 INSANE (2.00%+) - Everywhere!
🏋️ HEAVY (0.85%-1.99%) - Common
🔮 MEDIUM (0.65%-0.84%) - Regular
🤏 LOW (0.30%-0.64%) - Uncommon
👀 MINIMAL (<0.30%) - Very rare
💀 NOPE (0.00%) - Not spawning

───────────────────
💎 ORDER OPTIONS:
───────────────────
✨ SHUNDO - 100% IV + Shiny
💯 HUNDO - 100% IV only
🏆 PvP - Top IVs for GBL
⭐ SHINY - Random IVs
🎲 NORMAL - Any IV

───────────────────
🏷️ TAGS:
───────────────────
🌍 Regional - Location locked
🏆 PvP rank tag

───────────────────
🔍 FILTER
───────────────────
• Search by name or ID
• Filter by Regional, PvP, Shiny odds`
  },

  raids: {
    title: "🏆 Raids Help",
    content: `🏆 RAIDS HELP 🏆

───────────────────
📊 CURRENT RAID ROTATION
───────────────────
• Shows all currently available raids
• Pulled from multiple data sources

───────────────────
🎯 RAID TIERS:
───────────────────
• Tier 1-3 - Soloable
• Tier 4-5 - Need 2-5 players
• Mega - 2-4 players
• Shadow - Tougher, can purify
• Dynamax/Gigantamax - Special mechanics
• Ultra Beast - Special category

───────────────────
💰 RAID PRICING:
───────────────────
🐶 Normal Raids:
• 10 raids = $7
• 20 raids = $12
• 50 raids = $20

⚡ Dynamax Raids:
• 4 raids = $10

───────────────────
✨ SHINY AVAILABILITY
───────────────────
• ✨ indicator shows shiny available
• Legendaries: ~1/20 odds
• Regular: ~1/512 odds`
  },

  dex: {
    title: "📋 Dex Help",
    content: `📋 DEX CHECKLIST HELP

───────────────────
🔍 SEARCH
───────────────────
• Search by Pokémon name or ID
• Results show checked and unchecked

───────────────────
✅ ADD TO YOUR LIST
───────────────────
• Check the box - auto-saves immediately
• Appears in your checklist

───────────────────
❌ REMOVE FROM YOUR LIST
───────────────────
• Uncheck to mark for removal
• Tap "Confirm Removal" to finalize
• Tap "Cancel Removal" to undo

───────────────────
📑 TABS
───────────────────
• Normal - Standard Pokémon
• Shiny - Pokémon with shiny variants

───────────────────
🌍 REGION FILTER
───────────────────
• Filter by Kanto, Johto, etc.
• Shows Pokémon from selected generation`
  },

  events: {
    title: "📅 Events Help",
    content: `📅 EVENTS HELP

───────────────────
📅 CURRENT EVENTS
───────────────────
• Events happening today
• Based on date, not time

───────────────────
📅 UPCOMING EVENTS
───────────────────
• Events starting tomorrow or later
• Shows future events

───────────────────
📑 CATEGORIES
───────────────────
• STARTING TODAY
• ON-GOING
• NEXT 7 DAYS
• THIS MONTH
• FUTURE

───────────────────
📝 RSVP
───────────────────
• Click RSVP to sign up
• Enter name and IGN
• Select your admin
• Check status in History

───────────────────
📸 INFOGRAPHICS
───────────────────
• Weekly and Monthly graphics
• Pinch to zoom on images`
  },

  orders: {
    title: "📦 Orders Help",
    content: `📦 ORDERS HELP

───────────────────
🛒 YOUR CART
───────────────────
• Items you've added to your order
• Use +/- to adjust quantity
• 🗑️ Delete to remove item
• Total updates automatically

───────────────────
💰 ADD COINS
───────────────────
• 5,600 - $24
• 15,500 - $45
• 31,000 - $85
• 31k orders can be split between 2 accounts

───────────────────
📝 OTHER REQUESTS
───────────────────
• Add special instructions
• Time preferences

───────────────────
📱 CONTACT YOUR ADMIN
───────────────────
• Message your assigned admin directly
• Questions or special requests`
  },

  history: {
    title: "📜 History Help",
    content: `📜 HISTORY HELP

───────────────────
📦 MY ORDERS
───────────────────
• View all your past orders
• Click an order to see details
• Shows status (Pending/Paid)

───────────────────
📅 MY RSVPs
───────────────────
• View all your event RSVPs
• Shows status (Pending/Confirmed)
• Click event name to open link

───────────────────
🔍 SEARCH
───────────────────
• Enter your name and IGN
• Both required to find your history

───────────────────
⏳ TIMING
───────────────────
• Recent Orders/RSVPs may take up to 30 minutes to populate`
  }
};

export function getHelpContent(page: string): { title: string; content: string } {
  return HELP_CONTENT[page as keyof typeof HELP_CONTENT] || {
    title: "Help",
    content: "No help content available for this page."
  };
}