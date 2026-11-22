'use client';
import { genererSemaine } from '@/lib/generator';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Preferences } from '@/lib/types';

const EQUIPEMENTS = ['Four', 'Air Fryer', 'Cookeo', 'Thermomix', 'Micro-ondes', 'Machine à pain'];

const DEFAUT: Preferences = {
  personnes: 2, days: 7, meals: 'midi et soir', budgetMax: 5,
  regime: 'classique', excludedFoods: [], maxTime: 60, equipements: [], frigo: [],
};

export default function Formulaire() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<Preferences>(DEFAUT);
  const [aliment, setAliment] = useState('');
  const [frigoItem, setFrigoItem] = useState('');

  const maj = <K extends keyof Preferences>(cle: K, valeur: Preferences[K]) =>
    setPrefs((p) => ({ ...p, [cle]: valeur }));

  const ajouter = (liste: 'excludedFoods' | 'frigo', valeur: string, reset: () => void) => {
    const v = valeur.trim().toLowerCase();
    if (v && !prefs[liste].includes(v)) maj(liste, [...prefs[liste], v]);
    reset();
  };

  const valider = () => {
    localStorage.setItem('popotte_prefs', JSON.stringify(prefs));
    localStorage.setItem('popotte_semaine', JSON.stringify(genererSemaine(prefs)));
    router.push('/menu');
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Personnalisez votre menu</h1>

      <div>
        <label className="block mb-2 font-medium">Nombre de personnes : <strong>{prefs.personnes}</strong></label>
        <input type="range" min={1} max={10} value={prefs.personnes}
          onChange={(e) => maj('personnes', Number(e.target.value))} className="w-full" />
      </div>

      <div>
        <label className="block mb-2 font-medium">Nombre de jours</label>
        <div className="flex gap-2">
          {[5, 7].map((j) => (
            <button key={j} type="button" onClick={() => maj('days', j)}
              className={`px-6 py-2 rounded-full text-sm border transition ${prefs.days === j ? 'bg-sauge-500 text-white border-sauge-500' : 'bg-white'}`}>
              {j} jours
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Repas à planifier</label>
        <div className="flex flex-wrap gap-2">
          {(['midi', 'soir', 'midi et soir'] as const).map((m) => (
            <button key={m} type="button" onClick={() => maj('meals', m)}
              className={`px-6 py-2 rounded-full text-sm border transition ${prefs.meals === m ? 'bg-sauge-500 text-white border-sauge-500' : 'bg-white'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Budget maximum par repas et par personne : <strong>{prefs.budgetMax} €</strong>
        </label>
        <input type="range" min={1} max={15} step={0.5} value={prefs.budgetMax}
          onChange={(e) => maj('budgetMax', Number(e.target.value))} className="w-full" />
      </div>

      <div>
        <label className="block mb-2 font-medium">Régime alimentaire</label>
        <select value={prefs.regime} onChange={(e) => maj('regime', e.target.value as Preferences['regime'])}
          className="w-full p-3 rounded-lg border bg-white">
          <option value="classique">Classique</option>
          <option value="vegetarien">Végétarien</option>
          <option value="vegetalien">Végétalien</option>
          <option value="sans gluten">Sans gluten</option>
        </select>
      </div>

      <div>
        <label className="block mb-2 font-medium">Aliments à éviter (allergies, goûts...)</label>
        <div className="flex gap-2">
          <input value={aliment} onChange={(e) => setAliment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter('excludedFoods', aliment, () => setAliment('')))}
            placeholder="Ex : porc, arachide..." className="flex-1 p-3 rounded-lg border" />
          <button type="button" onClick={() => ajouter('excludedFoods', aliment, () => setAliment(''))}
            className="px-4 py-2 rounded-lg bg-sauge-500 text-white">Ajouter</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {prefs.excludedFoods.map((a) => (
            <span key={a} className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm flex items-center gap-2">
              {a}
              <button type="button" onClick={() => maj('excludedFoods', prefs.excludedFoods.filter((x) => x !== a))}>✕</button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Temps maximum par repas : <strong>{prefs.maxTime} min</strong></label>
        <input type="range" min={15} max={120} step={5} value={prefs.maxTime}
          onChange={(e) => maj('maxTime', Number(e.target.value))} className="w-full" />
      </div>

      <div>
        <label className="block mb-2 font-medium">Équipements disponibles</label>
        <div className="flex flex-wrap gap-2">
          {EQUIPEMENTS.map((eq) => (
            <button key={eq} type="button"
              onClick={() => maj('equipements', prefs.equipements.includes(eq)
                ? prefs.equipements.filter((x) => x !== eq) : [...prefs.equipements, eq])}
              className={`px-4 py-2 rounded-full text-sm border transition ${prefs.equipements.includes(eq) ? 'bg-sauge-500 text-white border-sauge-500' : 'bg-white'}`}>
              {eq}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 font-medium">Ce que vous avez déjà dans le réfrigérateur</label>
        <div className="flex gap-2">
          <input value={frigoItem} onChange={(e) => setFrigoItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), ajouter('frigo', frigoItem, () => setFrigoItem('')))}
            placeholder="Ex : riz, œufs, carottes..." className="flex-1 p-3 rounded-lg border" />
          <button type="button" onClick={() => ajouter('frigo', frigoItem, () => setFrigoItem(''))}
            className="px-4 py-2 rounded-lg bg-sauge-500 text-white">Ajouter</button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {prefs.frigo.map((f) => (
            <span key={f} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm flex items-center gap-2">
              {f}
              <button type="button" onClick={() => maj('frigo', prefs.frigo.filter((x) => x !== f))}>✕</button>
            </span>
          ))}
        </div>
      </div>

      <button onClick={valider}
        className="w-full bg-sauge-500 text-white py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition">
        Générer mon menu de la semaine ✨
      </button>
    </main>
  );
}
