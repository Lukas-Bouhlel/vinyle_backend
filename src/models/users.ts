import { model, Schema, Types, type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  createdAt: Date;
  roles: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    unique: true, 
    required: [true, "L'email est requis"],
    trim: true,
    lowercase: true 
  },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  password: { 
    type: String, 
    required: true, 
    select: false
  },
  createdAt: { type: Date, default: Date.now },
  roles: {
    type: [{ type: Schema.Types.ObjectId, ref: "roles" }],
    validate: {
      validator: function (v: any[]) {
        return v && v.length > 0;
      },
      message: "Un utilisateur doit avoir au moins un rôle.",
    },
  },
});

const User = model<IUser>("users", userSchema);

export { User };