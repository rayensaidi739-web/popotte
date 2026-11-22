import Link from 'next/link';

const FEATURES = [
  { icon: '📅', titre: 'Menus sur mesure', texte: '7 jours de repas selon vos préférences, votre budget et votre temps.' },
  { icon: '🛒', texte: 'Liste de courses automatique, regroupée par rayon et déduite de votre frigo.', titre: 'Listes de courses' },
  { icon: '📖', titre: 'Recettes détaillées', texte: 'Ingrédients, étapes, temps de préparation et coût par personne.' },
  { icon: '💚', titre: '100% gratuit', texte: 'Sans compte, sans abonnement. Vos menus sont sauvegardés sur votre appareil.' },
];

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🌿</div>
      <h1 className="text-4xl sm:text-5xl font-bold text-sauge-700">Popotte</h1>
      <p className="text-xl text-gray-600 mt-4">Ta popotte, toute prête.</p>
      <Link href="/formulaire"
        className="inline-block mt-8 px-8 py-4 bg-sauge-500 text-white rounded-xl text-lg font-semibold hover:opacity-90 transition">
        Créer mon menu gratuitement
      </Link>
      <div className="grid sm:grid-cols-2 gap-6 mt-16 text-left">
        {FEATURES.map((f) => (
          <div key={f.titre} className="bg-white rounded-xl border border-sauge-100 p-6 shadow-sm">
            <div className="text-3xl">{f.icon}</div>
            <h2 className="font-bold text-lg text-gray-800 mt-3">{f.titre}</h2>
            <p className="text-gray-600 mt-1">{f.texte}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
