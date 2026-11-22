'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSemaine } from '@/lib/storage';
import { construireListe, LigneCourse } from '@/lib/shoppingList';

export default function CoursesPage() {
  const { semaine, charge } = useSemaine();
  const [cochees, setCochees] = useState<Set<string>>(new Set());

  useEffect(() => {
    const data = localStorage.getItem('popotte_cochees');
    if (data) { try { setCochees(new Set(JSON.parse(data))); } catch {} }
  }, []);

  if (!charge) return <main className="max-w-2xl mx-auto px-4 py-10">Chargement…</main>;

  if (!semaine) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-xl">Aucun menu en cours. 🍽️</p>
        <Link href="/formulaire" className="inline-block bg-sauge-500 text-white px-6 py-3 rounded-xl font-semibold">
          Créer mon menu
        </Link>
      </main>
    );
  }

  const listes = construireListe(semaine);

  const basculer = (nom: string) => {
    setCochees((c) => {
      const next = new Set(c);
      next.has(nom) ? next.delete(nom) : next.add(nom);
      localStorage.setItem('popotte_cochees', JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-sauge-700">Ma liste de courses 🛒</h1>

      {Object.entries(listes).map(([rayon, lignes]) => (
        <section key={rayon}>
          <h2 className="text-lg font-bold text-gray-800 mb-2">{rayon}</h2>
          <ul className="bg-white rounded-xl border border-sauge-100 divide-y divide-sauge-50">
            {lignes.map((l: LigneCourse) => (
              <li key={l.nom} className="px-4 py-2 flex items-center gap-3">
                <input type="checkbox" checked={cochees.has(l.nom)} onChange={() => basculer(l.nom)} />
                <span className={`capitalize flex-1 ${cochees.has(l.nom) ? 'line-through text-gray-400' : ''}`}>
                  {l.nom}
                </span>
                {l.auFrigo && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">déjà au frigo</span>}
                <span className="text-gray-500">{l.qty} {l.unite}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <button onClick={() => window.print()}
        className="w-full bg-sauge-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
        🖨️ Imprimer la liste
      </button>
    </main>
  );
}
