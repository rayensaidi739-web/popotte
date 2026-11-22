export interface Ingredient {
  nom: string;
  qty: number; // quantité par personne
  unite: string;
  rayon: string;
}

export interface Recette {
  id: string;
  nom: string;
  kws: string[];
  cat: string;
  prepTime: number;
  cookTime: number;
  kcal: number;
  costPerPerson: number;
  ingredients: Ingredient[];
  etapes: string[];
  vegetarien: boolean;
  vegetalien: boolean;
  sansgluten: boolean;
}

export interface Preferences {
  personnes: number;
  days: number;
  meals: "midi" | "soir" | "midi et soir";
  budgetMax: number; // € par personne et par repas
  regime: "classique" | "vegetarien" | "vegetalien" | "sans gluten";
  excludedFoods: string[];
  maxTime: number;
  equipements: string[];
  frigo: string[];
}

export interface Semaine {
  prefs: Preferences;
  jours: (Recette | null)[][];
}
