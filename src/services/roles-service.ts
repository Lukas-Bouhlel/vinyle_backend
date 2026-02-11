import type { IRole } from "@/models/roles";
import { Role } from "@/models/roles";

interface ServiceResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

export const roleService = {

  fetchById: async (req): Promise<IRole | null> => {
    const { id } = req.param();
    return await Role.findOne({ _id: id });
  },
  createOne: async (req): Promise<ServiceResponse<IRole>> => {
    const body = await req.json();
    try {
      const newRole = new Role(body);
      const tryToCreate = await newRole.save();
      return { ok: true, data: tryToCreate };
    }
    catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return { ok: false, message };
    }
  },

};
