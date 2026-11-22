import { Recette, Preferences, Semaine } from './types';
import { RECETTES } from './recipes';

const REGIME_OK: Record<string, (r: Recette) => boolean> = {
  'vegetarien': (r) => r.vegetarien,
  'vegetalien': (r) => r.vegetalien,
  'sans gluten': (r) => r.sansgluten,
};

function texte(r: Recette): string {
  return (r.nom + ' ' + r.ingredients.map((i) => i.nom).join(' ')).toLowerCase();
}

export function filtrerRecettes(prefs: Preferences): Recette[] {
  const interdits = prefs.excludedFoods.map((f) => f.toLowerCase());
  const frigo = prefs.frigo.map((f) => f.toLowerCase());
  return RECETTES.filter((r) => {
    const t = texte(r);
    if (interdits.some((f) => t.includes(f))) return false;
    const check = REGIME_OK[prefs.regime];
    if (check && !check(r)) return false;
    if (prefs.maxTime && r.prepTime + r.cookTime > prefs.maxTime) return false;
    if (prefs.budgetMax && r.costPerPerson > prefs.budgetMax) return false;
    return true;
  }).sort((a, b) => {
    // bonus : recettes utilisant ce qu'il y a au frigo
    const sa = frigo.filter((f) => texte(a).includes(f)).length;
    const sb = frigo.filter((f) => texte(b).includes(f)).length;
    return sb - sa;
  });
}

function choisir(eligible: Recette[], utilises: Set<string>): Recette | null {
  if (eligible.length === 0) return null;
  const frais = eligible.filter((r) => !utilises.has(r.id));
  const pool = frais.length > 0 ? frais : eligible;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function genererSemaine(prefs: Preferences): Semaine {
  const eligible = filtrerRecettes(prefs);
  const nbRepas = prefs.meals === 'midi et soir' ? 2 : 1;
  const jours: (Recette | null)[][] = [];
  const utilises = new Set<string>();
  for (let j = 0; j < prefs.days; j++) {
    const jour: (Recette | null)[] = [];
    for (let r = 0; r < nbRepas; r++) {
      const rec = choisir(eligible, utilises);
      if (rec) utilises.add(rec.id);
      jour.push(rec);
    }
    jours.push(jour);
  }
  return { prefs, jours };
}

export function remplacerRepas(semaine: Semaine, jour: number, repas: number): Semaine {
  const eligible = filtrerRecettes(semaine.prefs);
  const actuel = semaine.jours[jour]?.[repas];
  const autres = new Set(semaine.jours.flat().filter(Boolean).map((r) => r!.id));
  if (actuel) autres.delete(actuel.id);
  const rec = choisir(eligible.filter((r) => !autres.has(r.id)), new Set());
  const jours = semaine.jours.map((j, ji) =>
    j.map((r, ri) => (ji === jour && ri === repas ? rec ?? r : r))
  );
  return { ...semaine, jours };
}

export function coutTotalSemaine(semaine: Semaine): { total: number; parPersonne: number } {
  let total = 0;
  for (const jour of semaine.jours)
    for (const r of jour) if (r) total += r.costPerPerson * semaine.prefs.personnes;
  return { total: Math.round(total * 100) / 100, parPersonne: Math.round((total / semaine.prefs.personnes) * 100) / 100 };
}
