const CHAT_ID = "-5158715004";

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function clean(value, maxLength = 200) {
  return String(value || "")
    .trim()
    .replace(/[<>]/g, "")
    .slice(0, maxLength);
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return json(200, { ok: true });
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  const botToken = process.env.BOT_TOKEN;
  if (!botToken) {
    return json(500, { error: "BOT_TOKEN is not configured" });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (error) {
    return json(400, { error: "Invalid JSON" });
  }

  const name = clean(payload.name);
  const phone = clean(payload.phone, 60);
  const city = clean(payload.city);
  const contactMethod = clean(payload.contactMethod, 60);

  if (!name || !phone || !city) {
    return json(400, { error: "Name, phone, and city are required" });
  }

  const text = [
    "New Bay Area Leak Detection request",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `City: ${city}`,
    `Preferred contact: ${contactMethod || "Phone call"}`,
    "",
    "Offer: $79 leak detection special",
  ].join("\n");

  const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      disable_web_page_preview: true,
    }),
  });

  if (!telegramResponse.ok) {
    return json(502, { error: "Telegram request failed" });
  }

  return json(200, { ok: true });
};
