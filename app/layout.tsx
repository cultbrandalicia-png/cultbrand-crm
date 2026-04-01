'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '▦' },
  { href: '/prospectos', label: 'Prospectos', icon: '◉' },
  { href: '/pipeline', label: 'Pipeline', icon: '⇥' },
  { href: '/linkedin', label: 'LinkedIn', icon: '🔗' },
  { href: '/mailer', label: 'Mailer', icon: '✉' },
  { href: '/radar', label: 'Radar', icon: '◎' },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-gray-900 text-white flex flex-col z-40">
      <div className="px-6 py-5 border-b border-gray-800">
        <span className="text-lg font-bold tracking-tight text-white">CultBrand CRM</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-500">
        cultbrand-crm v1.0
      </div>
    </aside>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="ml-56 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
