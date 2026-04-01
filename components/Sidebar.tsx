'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',            label: 'Dashboard'  },
  { href: '/prospectos', label: 'Prospectos' },
  { href: '/pipeline',   label: 'Pipeline'   },
  { href: '/linkedin',   label: 'LinkedIn'   },
  { href: '/mailer',     label: 'Mailer'     },
  { href: '/radar',      label: 'Radar'      },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col bg-gray-900">
      <div className="flex h-16 items-center border-b border-gray-800 px-6">
        <span className="text-sm font-bold tracking-tight text-white">CultBrand CRM</span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ' +
                (active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white')
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-gray-800 px-4 py-3 text-xs text-gray-500">
        v1.0
      </div>
    </aside>
  );
}
