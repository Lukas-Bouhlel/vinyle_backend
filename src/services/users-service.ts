import type { HonoRequest } from "hono";
import { User, type IUser } from "@/models/users";
import { hasher } from "@/lib/hasher";

interface ServiceResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

interface UserLogin {
  email: string;
  password: string;
}

export const userService = {

  fetchByEmail: async (req: HonoRequest): Promise<IUser | null> => {
    const email = req.param("email");
    return await User.findOne({ email });
  },

  createOne: async (req: HonoRequest): Promise<ServiceResponse<IUser>> => {
    try {
      const body = await req.json();
      
      if (body.password) {
        body.password = hasher.do(body.password);
      }

      const newUser = new User(body);
      const savedUser = await newUser.save();
      
      const userObj = savedUser.toObject();
      delete userObj.password;

      return { ok: true, data: userObj as IUser };
    }
    catch (error: any) {
      if (error.code === 11000) {
        return { ok: false, message: "Cet email est déjà utilisé" };
      }
      const message = error instanceof Error ? error.message : "Erreur inconnue";
      return { ok: false, message };
    }
  },

  login: async (req: HonoRequest): Promise<ServiceResponse<Omit<IUser, "password">>> => {
    try {
      const body = await req.json() as UserLogin;
      
      // Pas de populate ici non plus
      const user = await User.findOne(
        { email: body.email }, 
        "+password" 
      ).lean();

      if (!user) {
        return { ok: false, message: "Utilisateur introuvable" };
      }

      const isPasswordValid = await hasher.verify(body.password, user.password as string);

      if (!isPasswordValid) {
        return { ok: false, message: "Échec de l'authentification" };
      }

      const { password, ...userWithoutPassword } = user;

      return { ok: true, data: userWithoutPassword as any };
    } catch (e) {
      return { ok: false, message: "Erreur lors du login" };
    }
  },
};