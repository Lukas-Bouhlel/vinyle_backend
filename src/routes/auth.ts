import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { JwtTokenExpired } from "hono/utils/jwt/types";
import * as z from "zod";
import { userService } from "@/services/users-service";
import { BAD_REQUEST, CONFLICT, CREATED, UNAUTHORIZED, OK } from "@/shared/constants/http-status-codes";
import env from "../../env";

const registerScheme = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  roles: z.array(z.string()).min(1, "Au moins un rôle est requis"),
});

const api = new Hono();

// REGISTER
api.post("/register", sValidator("json", registerScheme, async (result, c) => {
  if (!result.success) {
    return c.json({ msg: "Invalid inputs", errors: result.error }, BAD_REQUEST);
  }
  
  // Le body contient roles: ["GERANT"]. Le modèle User accepte ça. C'est parfait.
  const tryToCreate = await userService.createOne(c.req);
  
  if (!tryToCreate.ok) {
    return c.json({ msg: tryToCreate.message }, CONFLICT);
  }
  
  return c.json(tryToCreate.data, CREATED);
}));

// LOGIN
api.post("/login", async (c) => {
  const loginResult = await userService.login(c.req);
  
  if (!loginResult.ok || !loginResult.data) {
    return c.json({ msg: loginResult.message }, UNAUTHORIZED);
  }

  const { _id, email, roles } = loginResult.data;

  // roles est déjà ["GERANT"] (string[])
  const roleNames = roles || [];
  
  const payload = {
    sub: _id,
    email,
    roles: roleNames, 
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 5, 
  };
  
  const token = await sign(payload, env.JWT_SECRET, "HS256");

  return c.json({
    token,
    user: {
      _id,
      email,
      roles: roleNames
    }
  }, OK);
});

// ME
api.get("/me", async (c) => {
  const authHeader = c.req.header("Authorization");
  const token = authHeader && authHeader.startsWith("Bearer ") 
    ? authHeader.split(" ")[1] 
    : authHeader;

  if (!token) {
    return c.json({ msg: "No token provided" }, UNAUTHORIZED);
  }

  try {
    const decodedPayload = await verify(token, env.JWT_SECRET, "HS256");
    return c.json({ 
      email: decodedPayload.email, 
      sub: decodedPayload.sub,
      roles: decodedPayload.roles 
    });
  }
  catch (error) {
    if (error instanceof JwtTokenExpired) {
      return c.json({ msg: "Token expired" }, UNAUTHORIZED);
    }
    return c.json({ msg: "Invalid token" }, UNAUTHORIZED);
  }
});

export default api;