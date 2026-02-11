import { Hono } from "hono";
// import { notFound } from "@/middlewares/not-found";
// import vinyles from "@/routes/vinyles";
// import auth from "@/routes/auth";
// import roles from "@/routes/roles";

const app = new Hono({ strict: false }).basePath("/v1/api");

app.get("/", (c) => {
  return c.text("Hello Hono 🔥🦆");
});

// app.route("/vinyles", vinyles); // > donc v1/api/comments
// app.route("/auth", auth); // > donc v1/api/auth
// app.route("/roles", roles); // > donc v1/api/roles
// app.notFound(notFound);

export default app;