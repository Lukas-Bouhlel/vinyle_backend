import { createMiddleware } from "hono/factory";
import { FORBIDDEN, UNAUTHORIZED } from "@/shared/constants/http-status-codes";
import type { IUser } from "@/models/users";
import type { IRole } from "@/models/roles";

export const rbacGuard = (resource: string, action: string) => 
  createMiddleware(async (c, next) => {
    const user = c.get("user") as IUser; 

    if (!user) {
      return c.json({ message: "Authentication required" }, UNAUTHORIZED);
    }

    // Ici user.roles est un tableau d'objets car on a fait .populate('roles')
    const roles = user.roles as unknown as IRole[];

    if (!roles || roles.length === 0) {
      return c.json({ message: "No roles assigned" }, FORBIDDEN);
    }

    // On parcourt les objets Rôles complets pour vérifier les autorisations
    const hasPermission = roles.some((role) => {
      // Sécurité : si le populate a échoué pour une raison X, on saute
      if (!role || !role.authorizations) return false;

      const auth = role.authorizations.find((a) => a.ressource === resource);
      if (!auth) return false;

      return auth.permissions.full.includes(action) || auth.permissions.full.includes("*");
    });

    if (!hasPermission) {
      return c.json({ message: `Forbidden: You cannot ${action} ${resource}` }, FORBIDDEN);
    }

    await next();
  });