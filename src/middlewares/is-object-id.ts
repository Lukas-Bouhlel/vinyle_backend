import { createMiddleware } from "hono/factory"
import {isValidObjectId} from "mongoose";

export const isValidObjectIdMiddleware = createMiddleware(async (c, next) => {
  const id = c.req.param('id');
  if(!isValidObjectId(id)){
    return c.json({message: "Invalid ID format"}, 400);
  }
  await next()
})