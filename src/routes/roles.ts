import { Hono } from "hono";
import { roleService } from "@/services/roles-service";
import { BAD_REQUEST, CREATED } from "@/shared/constants/http-status-codes";
import { rbacGuard } from "@/middlewares/rbac-guard"; // <--- Import du Guard

const api = new Hono();

api.post("/", rbacGuard("roles", "create"), async (c) => {
  const newRole = await roleService.createOne(c.req);
  if (newRole.ok && newRole.data) {
    return c.json(newRole.data, CREATED);
  }
  return c.json({ msg: newRole.message || "error" }, BAD_REQUEST);
});

export default api;