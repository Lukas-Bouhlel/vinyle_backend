import { model, Schema, type Document } from "mongoose";

export const APP_ROLES = {
  MANAGER: "GERANT",
  EMPLOYEE: "DISQUAIRE",
} as const;

export interface Authorization {
  permissions: Permissions;
  ressource: string;
}

export interface Permissions {
  full: string[];
}

export interface IRole extends Document {
  name: string;
  description: string;
  authorizations: Authorization[];
}

const roleSchema = new Schema<IRole>({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  description: { type: String },
  authorizations: [{
    _id: false,
    permissions: {
      full: [{ type: String }],
    },
    ressource: { type: String, required: true },
  }],
}, { timestamps: true });

const Role = model<IRole>("roles", roleSchema);

export { Role };