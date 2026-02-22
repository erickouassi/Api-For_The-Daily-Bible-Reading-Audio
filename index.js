export default function handler(req, res) {
  res.status(200).json({
    name: "Daily Reading Audio API",
    description: "A free REST API for USCCB Daily Mass Reading Audio.",
    version: "1.0.0",
    endpoints: {
      root: "/api",
      today: "/api/today",
      yesterday: "/api/yesterday",
      tomorrow: "/api/tomorrow",
      month: "/api/month"
    },
    author: "Eric Kouassi"
  });
}
