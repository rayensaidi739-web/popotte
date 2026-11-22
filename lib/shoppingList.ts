import { Semaine } from './types';

const ORDRE = ['Fruits et légumes', 'Viandes', 'Poissons', 'Produits laitiers', 'Épicerie', 'Surgelés'];

export interface LigneCourse {
  nom: string;
  qty: number;
  unite: string;
  rayon: string;
  coche: boolean;
  auFrigo: boolean;
}

export function construireListe(semaine: Semaine): Record<string, LigneCourse[]> {
  const map = new Map<string, LigneCourse>();
  const frigo = semaine.prefs.frigo.map((f) => f.toLowerCase());
  for (const jour of semaine.jours) {
    for (const r of jour) {
      if (!r) continue;
      for (const ing of r.ingredients) {
        const existant = map.get(ing.nom);
        if (existant) existant.qty += ing.qty;
        else map.set(ing.nom, {
          nom: ing.nom, qty: ing.qty, unite: ing.unite, rayon: ing.rayon,
          coche: false, auFrigo: frigo.some((f) => ing.nom.includes(f)),
        });
      }
    }
  }
  const parRayon: Record<string, LigneCourse[]> = {};
  for (const ligne of map.values()) {
    // arrondi des quantités
    ligne.qty = Math.round(ligne.qty * 100) / 100;
    (parRayon[ligne.rayon] ??= []).push(ligne);
  }
  const trie: Record<string, LigneCourse[]> = {};
  for (const rayon of ORDRE) if (parRayon[rayon]) trie[rayon] = parRayon[rayon];
  return trie;
}
