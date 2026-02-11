import type { HonoRequest } from "hono";
import type { IVinyl } from "@/models/vinyles";
import { Vinyl } from "@/models/vinyles";
import { queryBuilder } from "@/lib/mongo-query-builder";

interface ServiceResponse<T> {
  ok: boolean;
  data?: T;
  count?: number;
  message?: string;
}

export const vinylService = {
  
  // Récupère tous les vinyles avec filtres avancés
  fetchAll: async (req: HonoRequest): Promise<ServiceResponse<IVinyl[]>> => {
    const query = req.query();
    const minPrice = query.minPrice;
    const maxPrice = query.maxPrice;
    delete query.minPrice;
    delete query.maxPrice;

    const { filter, projection, options } = queryBuilder.buildFind({ query });

    if (filter.group) {
      filter.group = { $regex: new RegExp(filter.group, 'i') };
    }

    if (minPrice || maxPrice) {
      filter.price = typeof filter.price === 'object' ? filter.price : {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    try {
      const xCount = await Vinyl.countDocuments(filter);
      const data = await Vinyl.find(filter, projection, options);
      
      return { ok: true, data, count: xCount };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error fetching vinyls";
      return { ok: false, message };
    }
  },

  // Récupère un vinyle par son ID
  fetchById: async (req: HonoRequest): Promise<ServiceResponse<IVinyl>> => {
    const id = req.param("id");
    try {
      const data = await Vinyl.findById(id);
      if (!data) return { ok: false, message: "Vinyle introuvable" };
      return { ok: true, data };
    } catch (error) {
      return { ok: false, message: "ID invalide" };
    }
  },

  // Crée un vinyle
  createOne: async (req: HonoRequest): Promise<ServiceResponse<IVinyl>> => {
    try {
      const body = await req.json();
      const newVinyl = new Vinyl(body);
      const savedVinyl = await newVinyl.save();
      
      return { ok: true, data: savedVinyl };
    } catch (error: any) {
      return { ok: false, message: error.message || "Erreur lors de la création" };
    }
  },

  // Update un vinyle
  updateOne: async (req: HonoRequest): Promise<ServiceResponse<IVinyl>> => {
    const id = req.param("id");
    try {
      const body = await req.json();
      
      const updatedVinyl = await Vinyl.findByIdAndUpdate(
        id, 
        body, 
        { new: true, runValidators: true } 
      );

      if (!updatedVinyl) return { ok: false, message: "Vinyle introuvable" };
      return { ok: true, data: updatedVinyl };
    } catch (error: any) {
      return { ok: false, message: error.message || "Erreur lors de la mise à jour" };
    }
  },

  // Delete un vinyle
  deleteOne: async (req: HonoRequest): Promise<ServiceResponse<null>> => {
    const id = req.param("id");
    try {
      const deleted = await Vinyl.findByIdAndDelete(id);
      if (!deleted) return { ok: false, message: "Vinyle introuvable" };
      return { ok: true, message: "Vinyle supprimé" };
    } catch (error) {
      return { ok: false, message: "Erreur lors de la suppression" };
    }
  }
};