'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { genererSemaine, remplacerRepas, coutTotalSemaine } from '@/lib/generator';
import { useSemaine } from '@/lib/storage';
import { Preferences } from '@/lib/types';
import MealCard from '@/components/MealCard';

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function MenuPage() {
  const { semaine, setSemaine, charge } = useSemaine();
  const [prefs, setPrefs] = useState<Preferences | null>(null);

  useEffect(() => {
    const data = localStorage.getItem('popotte_prefs');
    if (data) { try { setPrefs(JSON.parse(data)); } catch {} }
  }, []);

  if (!charge) return <main className="max-w-4xl mx-auto px-4 py-10">Chargement…</main>;

  if (!semaine || !prefs) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-xl">Aucun menu en cours. 🍽️</p>
        <Link href="/formulaire" className="inline-block bg-sauge-500 text-white px-6 py-3 rounded-xl font-semibold">
          Créer mon menu
        </Link>
      </main>
    );
  }

  const cout = coutTotalSemaine(semaine);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-sauge-700">Mon menu de la semaine</h1>
        <p className="text-gray-600 mt-1">
          {prefs.personnes} personne{prefs.personnes > 1 ? 's' : ''} · Budget estimé :{' '}
          <b>{cout.total.toFixed(2)} €</b> ({cout.parPersonne.toFixed(2)} €/pers)
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button onClick={() => { setPrefs(prefs); setSemaine(genererSemaine(prefs)); }}
          className="px-5 py-3 rounded-xl bg-sauge-500 text-white font-semibold hover:opacity-90 transition">
          🔄 Régénérer la semaine
        </button>
        <Link href="/courses"
          className="px-5 py-3 rounded-xl border-2 border-sauge-500 text-sauge-700 font-semibold hover:bg-sauge-500 hover:text-white transition">
          🛒 Ma liste de courses
        </Link>
      </div>

      <div className="space-y-8">
        {semaine.jours.map((jour, j) => (
          <section key={j} className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800">{JOURS[j] ?? `Jour ${j + 1}`}</h2>
            {jour.map((recette, r) =>
              recette ? (
                <MealCard key={r} recette={recette} personnes={prefs.personnes}
                  onRemplacer={() => setSemaine(remplacerRepas(semaine, j, r))} />
              ) : null
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
