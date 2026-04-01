'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',            label: 'Dashboard',   icon: '\uD83C\uDFE0' },
  { href: '/prospectos',  label: 'Prospectos',  icon: '\uD83C\uDFE2' },
  { href: '/pipeline',    label: 'Pipeline',    icon: '\uD83D\uDCC8' },
  { href: '/linkedin',    label: 'LinkedIn',    icon: '\uD83D\uDCBC' },
  { href: '/mailer',      label: 'Mailer',      icon: '\uD83D\uDCE7' },
  { href: '/radar',       label: 'Radar',       icon: '\uD83D\uDCF6' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-white border-r border-gray-100 shadow-sm">
      {/* Logo */}
      <div className="flex h-16 items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">CB</span>
          </div>
          <span className="text-sm font-bold text-gray-900 tracking-tight">CultBrand CRM</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ' +
                (active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
              }
            >
              <span className="text-base leading-none">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3">
        <p className="text-xs text-gray-400">v1.0</p>
      </div>
    </aside>
  );
}
