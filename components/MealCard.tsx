'use client';
import Link from 'next/link';
import { Recette } from '@/lib/types';

export default function MealCard({
  recette, personnes, onRemplacer,
}: {
  recette: Recette;
  personnes: number;
  onRemplacer?: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-sauge-100 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-16 h-16 rounded-lg bg-sauge-100 flex items-center justify-center text-2xl shrink-0">🍽️</div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{recette.nom}</h3>
        <p className="text-sm text-gray-500 mt-1">
          ⏱️ {recette.prepTime + recette.cookTime} min · 🔥 {recette.kcal} kcal
        </p>
        <p className="text-sm text-gray-500">
          💰 {recette.costPerPerson.toFixed(2)} €/pers · {(recette.costPerPerson * personnes).toFixed(2)} € total
        </p>
      </div>
      <div className="flex gap-2">
        {onRemplacer && (
          <button onClick={onRemplacer}
            className="px-3 py-2 text-sm rounded-lg border border-sauge-300 text-sauge-700 hover:bg-sauge-50">
            🔄 Remplacer
          </button>
        )}
        <Link href={`/recette/${recette.id}`}
          className="px-3 py-2 text-sm rounded-lg bg-sauge-500 text-white hover:opacity-90">
          Voir la recette
        </Link>
      </div>
    </div>
  );
}
