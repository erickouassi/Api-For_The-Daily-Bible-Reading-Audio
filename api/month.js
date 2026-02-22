import { fetchRssItems, formatShortDate, formatLongDate, getDayOfYear } from "./_utils/rss.js";

export default async function handler(req, res) {
  try {
    const items = await fetchRssItems();

    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth();

    const results = [];

    items.forEach(item => {
      const descNode = item.getElementsByTagName("description")[0];
      const desc = descNode?.textContent || "";

      const match = desc.match(/([A-Za-z]+ \d{1,2}, \d{4})/);
      if (!match) return;

      const dateStr = match[1];
      const d = new Date(dateStr);

      if (d.getFullYear() === year && d.getMonth() === monthIndex) {
        const enclosure = item.getElementsByTagName("enclosure")[0];
        const audioUrl = enclosure?.getAttribute("url") || null;

        results.push({
          track_id: getDayOfYear(d),
          audioAuthor: "USCCB Daily Readings ",
          audioDate: formatShortDate(d),
          audioMP3Link: audioUrl,
          audioMP3Date: formatLongDate(d)
        });
      }
    });

    res.status(200).json(results);
  } catch (err) {
    console.error("API /month error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
