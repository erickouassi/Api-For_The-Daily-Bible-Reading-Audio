// /api/_utils/rss.js
import fetch from "node-fetch";
import { DOMParser } from "@xmldom/xmldom";

const FEED_URL = "https://feeds.feedburner.com/usccb/zhqs";

export async function fetchRssItems() {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const xmlText = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");
  const items = Array.from(xml.getElementsByTagName("item"));

  return items;
}

export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// ⭐ NEW: return ALL items matching the date
export function findItemsByDate(items, date) {
  const formattedDate = formatDate(date);
  const results = [];

  items.forEach(item => {
    const descNode = item.getElementsByTagName("description")[0];
    const desc = descNode?.textContent || "";

    if (desc.includes(formattedDate)) {
      const enclosure = item.getElementsByTagName("enclosure")[0];
      const audioUrl = enclosure?.getAttribute("url") || null;

      // Title may include suffix like " - Supper"
      const titleNode = item.getElementsByTagName("title")[0];
      const title = titleNode?.textContent || formattedDate;

      results.push({
        audioMP3Date: title.replace("Daily Mass Reading Podcast for ", ""),
        audioMP3Link: audioUrl
      });
    }
  });

  return results;
}
