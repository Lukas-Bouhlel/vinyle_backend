import { Hono } from "hono";
import { isValidObjectIdMiddleware } from "@/middlewares/is-object-id";
import { rbacGuard } from "@/middlewares/rbac-guard"; // <--- Import du Guard
import { vinylService } from "@/services/vinyles-service";
import { 
  NO_CONTENT, NOT_FOUND, CREATED, OK, BAD_REQUEST 
} from "@/shared/constants/http-status-codes";

const api = new Hono();

api.get("/", rbacGuard("vinyls", "read"), async (c) => {
  const allVinyles = await vinylService.fetchAll(c.req);
  if (!allVinyles.ok) return c.json({ message: allVinyles.message }, BAD_REQUEST);
  
  c.header("X-Count", `${allVinyles.count}`);
  return c.json(allVinyles.data, OK);
});

api.get("/:id", isValidObjectIdMiddleware, rbacGuard("vinyls", "read"), async (c) => {
  const oneVinyl = await vinylService.fetchById(c.req);
  if (!oneVinyl.ok) return c.json({ message: oneVinyl.message }, NOT_FOUND);
  return c.json(oneVinyl.data, OK);
});

api.post("/", rbacGuard("vinyls", "create"), async (c) => {
  const creation = await vinylService.createOne(c.req);
  if (!creation.ok) return c.json({ message: creation.message }, BAD_REQUEST);
  return c.json(creation.data, CREATED);
});

api.patch("/:id", isValidObjectIdMiddleware, rbacGuard("vinyls", "update"), async (c) => {
  const update = await vinylService.updateOne(c.req);
  if (!update.ok) return c.json({ message: update.message }, BAD_REQUEST);
  return c.json(update.data, OK);
});

api.delete("/:id", isValidObjectIdMiddleware, rbacGuard("vinyls", "delete"), async (c) => {
  const deletion = await vinylService.deleteOne(c.req);
  if (!deletion.ok) return c.json({ message: deletion.message }, NOT_FOUND);
  return c.body(null, NO_CONTENT);
});

export default api;