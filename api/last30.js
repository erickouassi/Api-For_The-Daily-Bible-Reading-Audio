import { fetchRssItems, findItemsByDate } from "./_utils/rss.js";

export default async function handler(req, res) {
  try {
    const items = await fetchRssItems();

    const today = new Date();
    const results = [];

    // Loop through last 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const dayResults = findItemsByDate(items, d);

      // Only push if readings exist for that day
      if (dayResults.length > 0) {
        results.push(...dayResults);
      }
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("API /last30 error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
