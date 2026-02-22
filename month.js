// /api/month.js
import { fetchRssItems, getMonthItems } from "./_utils/rss.js";

export default async function handler(req, res) {
  try {
    const items = await fetchRssItems();

    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0–11

    const results = getMonthItems(items, year, monthIndex);

    return res.status(200).json(results);
  } catch (err) {
    console.error("API /month error:", err);
    return res.status(500).json([]);
  }
}
