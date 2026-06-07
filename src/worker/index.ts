import { Hono } from "hono";

type WorkerBindings = Env & {
	COURSEDECK_VERSION: string;
};

const COURSEDECK_DOWNLOAD_NAME = "coursedeck";

function getCoursedeckObjectKey(version: string) {
	return `${COURSEDECK_DOWNLOAD_NAME}-${version}.xpi`;
}

async function downloadCoursedeck(c: {
	env: WorkerBindings;
	text: (text: string, status?: number) => Response;
}) {
	const objectKey = getCoursedeckObjectKey(c.env.COURSEDECK_VERSION);
	const object = await c.env.WEBSITE_BUCKET.get(objectKey);

	if (!object) {
		return c.text(`${objectKey} not found in bucket`, 404);
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	headers.set("content-type", "application/x-xpinstall");

	return new Response(object.body, { headers });
}

const app = new Hono<{ Bindings: WorkerBindings }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/downloads/coursedeck-latest.xpi", downloadCoursedeck);

export default app;
