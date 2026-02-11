import { serve } from "@hono/node-server";
import env from "../env";
import app from "./app";
import { DbConnect } from "./db";

await DbConnect();

serve({
  fetch: app.fetch,
  port: Number(process.env.SERVER_PORT) || 3000, 
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}/v1/api`);
});
