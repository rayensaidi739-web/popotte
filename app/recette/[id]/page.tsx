'use client';
import { use } from 'react';
import Link from 'next/link';
import { getRecetteById } from '@/lib/recipes';

export default function RecettePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const recette = getRecetteById(id);

  if (!recette) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p>Recette introuvable. 🤔</p>
        <Link href="/menu" className="text-sauge-700 underline">Retour au menu</Link>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <Link href="/menu" className="text-sauge-700 text-sm">← Retour au menu</Link>
      <div className="h-48 rounded-2xl bg-sauge-100 flex items-center justify-center text-6xl">🍽️</div>
      <h1 className="text-3xl font-bold text-gray-800">{recette.nom}</h1>
      <p className="text-gray-600">
        ⏱️ Préparation {recette.prepTime} min · Cuisson {recette.cookTime} min · 🔥 {recette.kcal} kcal ·{' '}
        💰 {recette.costPerPerson.toFixed(2)} €/pers
      </p>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Ingrédients (par personne)</h2>
        <ul className="bg-white rounded-xl border border-sauge-100 divide-y divide-sauge-50">
          {recette.ingredients.map((i) => (
            <li key={i.nom} className="px-4 py-2 flex justify-between">
              <span className="capitalize">{i.nom}</span>
              <span className="text-gray-500">{i.qty} {i.unite}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Préparation</h2>
        <ol className="space-y-2 list-decimal list-inside text-gray-700">
          {recette.etapes.map((e, i) => <li key={i}>{e}</li>)}
        </ol>
      </section>
    </main>
  );
}
