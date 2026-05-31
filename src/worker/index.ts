import { Hono } from "hono";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/downloads/coursedeck-latest.xpi", async (c) => {
  const objectKey = "coursedeck-latest.xpi";
  const object = await c.env.WEBSITE_BUCKET.get(objectKey);

  if (!object) {
    return c.text("coursedeck-latest.xpi not found in bucket", 404);
  }

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	headers.set("content-type", "application/x-xpinstall");

	return new Response(object.body, { headers });
});

export default app;
