import { createMiddleware } from "hono/factory";
import { verify } from "hono/jwt";
import { UNAUTHORIZED } from "@/shared/constants/http-status-codes";
import { User } from "@/models/users";
import env from "../../env"; 

export const authentication = createMiddleware(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  
  if (!authHeader) {
    return c.json({ message: "Authentication required" }, UNAUTHORIZED);
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
  
  if (!token) {
    return c.json({ message: "Invalid token format" }, UNAUTHORIZED);
  }

  try {
    const payload = await verify(token, env.JWT_SECRET, "HS256");
    
    // On charge l'utilisateur ET on remplace les IDs de rôles par les objets Rôles complets
    const user = await User.findById(payload.sub).populate("roles");
    
    if (!user) {
      return c.json({ message: "User not found" }, UNAUTHORIZED);
    }

    c.set("user", user);
    await next();
  } catch (error) {
    return c.json({ message: "Invalid or expired token" }, UNAUTHORIZED);
  }
});