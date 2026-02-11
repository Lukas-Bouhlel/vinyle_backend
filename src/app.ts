import { Hono } from "hono";
import { notFound } from "@/middlewares/not-found";
import vinyles from "@/routes/vinyles";
import auth from "@/routes/auth";
import roles from "@/routes/roles";
import { authentication } from "./middlewares/auth";

const app = new Hono({ strict: false }).basePath("/v1/api");

app.get("/", (c) => {
  return c.text("Hello Hono 🔥🦆");
});

app.route("/auth", auth);

app.use("/vinyles/*", authentication);
app.use("/roles/*", authentication);
app.route("/vinyles", vinyles);
app.route("/roles", roles);

app.notFound(notFound);

export default app;