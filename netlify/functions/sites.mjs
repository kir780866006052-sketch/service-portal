import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("portal");

  if (req.method === "GET") {
    const data = await store.get("sites", { type: "json" });
    return new Response(JSON.stringify(data || []), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "invalid json" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!Array.isArray(body)) {
      return new Response(JSON.stringify({ error: "expected an array" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await store.setJSON("sites", body);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = {
  path: "/api/sites"
};
