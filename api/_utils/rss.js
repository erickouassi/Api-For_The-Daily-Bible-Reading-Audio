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

export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function findItemsByDate(items, date) {
  const formatted = formatDate(date);
  const results = [];

  items.forEach(item => {
    const descNode = item.getElementsByTagName("description")[0];
    const desc = descNode?.textContent || "";

    if (desc.includes(formatted)) {
      const enclosure = item.getElementsByTagName("enclosure")[0];
      const audioUrl = enclosure?.getAttribute("url") || null;

      const titleNode = item.getElementsByTagName("title")[0];
      const title = titleNode?.textContent || formatted;

      results.push({
        audioMP3Date: title.replace("Daily Mass Reading Podcast for ", ""),
        audioMP3Link: audioUrl
      });
    }
  });

  return results;
}
