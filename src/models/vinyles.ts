import { model, Schema } from "mongoose";

export const VINYL_CONDITION = {
  NEUF: "NEUF",
  BON: "COMME-NEUF",
  USE: "OCCASION",
} as const;

export type VinylCondition = keyof typeof VINYL_CONDITION;

export interface IVinyl {
  title: string;
  group: string;
  genres: string[];
  releaseDate: Date;
  price: number;
  condition: VinylCondition;
  quantity: number;
}

const vinylSchema = new Schema<IVinyl>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  group: {
    type: String,
    required: true,
    index: true, 
  },
  genres: {
    type: [String],
    default: [],
    index: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Le prix ne peut pas être négatif"],
  },
  condition: {
    type: String,
    required: true,
    enum: {
      values: Object.values(VINYL_CONDITION),
      message: "{VALUE} n'est pas un état valide (Attendu: NEUF, COMME-NEUF, OCCASION)",
    },
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, "La quantité ne peut pas être négative"],
  },
});

const Vinyl = model<IVinyl>("vinyls", vinylSchema);
export { Vinyl };
