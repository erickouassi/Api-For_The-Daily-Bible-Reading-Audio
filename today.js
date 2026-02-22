import { fetchRssItems, findItemsByDate } from "./_utils/rss.js";

export default async function handler(req, res) {
  try {
    const items = await fetchRssItems();
    const today = new Date();

    const results = findItemsByDate(items, today);

    return res.status(200).json(results);
  } catch (err) {
    console.error("API /today error:", err);
    return res.status(500).json([]);
  }
}
