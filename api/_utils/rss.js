import { DOMParser } from "@xmldom/xmldom";

const FEED_URL = "https://feeds.feedburner.com/usccb/zhqs";

export async function fetchRssItems() {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0" }
  });

  const xmlText = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(xmlText, "text/xml");

  return Array.from(xml.getElementsByTagName("item"));
}

export function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = date - start;
  return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
}

export function formatShortDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export function formatLongDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// ⭐ Returns ALL readings for the date in your required format
export function findItemsByDate(items, date) {
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const results = [];

  items.forEach(item => {
    const descNode = item.getElementsByTagName("description")[0];
    const desc = descNode?.textContent || "";

    if (desc.includes(formattedDate)) {
      const enclosure = item.getElementsByTagName("enclosure")[0];
      const audioUrl = enclosure?.getAttribute("url") || null;

      results.push({
        track_id: getDayOfYear(date),
        audioAuthor: "USCCB Daily Readings ",
        audioDate: formatShortDate(date),
        audioMP3Link: audioUrl,
        audioMP3Date: formatLongDate(date)
      });
    }
  });

  return results;
}
