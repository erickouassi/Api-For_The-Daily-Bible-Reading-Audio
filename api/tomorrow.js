import { fetchRssItems, findItemsByDate } from "./_utils/rss.js";

export default async function handler(req, res) {
  try {
    const items = await fetchRssItems();
    const d = new Date();
    d.setDate(d.getDate() + 1);

    const results = findItemsByDate(items, d);

    res.status(200).json(results);
  } catch (err) {
    console.error("API /tomorrow error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
