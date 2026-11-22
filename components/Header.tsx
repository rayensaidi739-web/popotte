'use client';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white border-b border-sauge-100">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-sauge-700">🌿 Popotte</Link>
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/menu" className="hover:text-sauge-700">Mon menu</Link>
          <Link href="/courses" className="hover:text-sauge-700">Courses</Link>
          <Link href="/formulaire" className="px-4 py-2 rounded-full bg-sauge-500 text-white hover:opacity-90">
            Créer mon menu
          </Link>
        </nav>
      </div>
    </header>
  );
}
