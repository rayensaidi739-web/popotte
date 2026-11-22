'use client';
import { useEffect, useState } from 'react';
import { Semaine, Recette } from './types';

const CLE = 'popotte_semaine';
const CLE_FAV = 'popotte_favoris';

export function useSemaine() {
  const [semaine, setSemaineState] = useState<Semaine | null>(null);
  const [charge, setCharge] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(CLE);
    if (data) { try { setSemaineState(JSON.parse(data)); } catch {} }
    setCharge(true);
  }, []);

  const setSemaine = (s: Semaine | null) => {
    setSemaineState(s);
    if (s) localStorage.setItem(CLE, JSON.stringify(s));
    else localStorage.removeItem(CLE);
  };

  return { semaine, setSemaine, charge };
}

export function useFavoris() {
  const [favoris, setFavorisState] = useState<{ id: string; nom: string }[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(CLE_FAV);
    if (data) { try { setFavorisState(JSON.parse(data)); } catch {} }
  }, []);

  const toggleFavori = (id: string, nom: string) => {
    setFavorisState((f) => {
      const next = f.some((x) => x.id === id) ? f.filter((x) => x.id !== id) : [...f, { id, nom }];
      localStorage.setItem(CLE_FAV, JSON.stringify(next));
      return next;
    });
  };

  return { favoris, toggleFavori };
}
