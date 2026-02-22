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

export function findItemByDate(items, date) {
  const formattedDate = formatDate(date);

  const match = items.find(item => {
    const descNode = item.getElementsByTagName("description")[0];
    const desc = descNode && descNode.textContent ? descNode.textContent : "";
    return desc.includes(formattedDate);
  });

  if (!match) return null;

  const enclosure = match.getElementsByTagName("enclosure")[0];
  const audioUrl = enclosure?.getAttribute("url") || null;

  return {
    audioMP3Date: formattedDate,
    audioMP3Link: audioUrl
  };
}

export function getMonthItems(items, year, monthIndex) {
  // monthIndex: 0–11
  const results = [];

  items.forEach(item => {
    const descNode = item.getElementsByTagName("description")[0];
    const desc = descNode && descNode.textContent ? descNode.textContent : "";

    // Try to extract "Month D, YYYY" from description
    const match = desc.match(/([A-Za-z]+ \d{1,2}, \d{4})/);
    if (!match) return;

    const dateStr = match[1];
    const d = new Date(dateStr);
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      const enclosure = item.getElementsByTagName("enclosure")[0];
      const audioUrl = enclosure?.getAttribute("url") || null;

      results.push({
        audioMP3Date: dateStr,
        audioMP3Link: audioUrl
      });
    }
  });

  return results;
}
