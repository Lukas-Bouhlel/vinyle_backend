import { createMiddleware } from "hono/factory";
import { FORBIDDEN, UNAUTHORIZED } from "@/shared/constants/http-status-codes";
import type { IUser } from "@/models/users";
import { Role } from "@/models/roles";

export const rbacGuard = (resource: string, action: string) => 
  createMiddleware(async (c, next) => {
    const user = c.get("user") as IUser; 

    if (!user) {
      return c.json({ message: "Authentication required" }, UNAUTHORIZED);
    }

    const userRoleNames = user.roles;

    if (!userRoleNames || userRoleNames.length === 0) {
      return c.json({ message: "No roles assigned" }, FORBIDDEN);
    }

    const rolesDefinitions = await Role.find({ name: { $in: userRoleNames } });

    const hasPermission = rolesDefinitions.some((role) => {
      const auth = role.authorizations.find((a) => a.ressource === resource);
      if (!auth) return false;

      return auth.permissions.full.includes(action) || auth.permissions.full.includes("*");
    });

    if (!hasPermission) {
      return c.json({ message: `Forbidden: You cannot ${action} ${resource}` }, FORBIDDEN);
    }

    await next();
  });