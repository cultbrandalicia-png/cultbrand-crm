'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Kanban } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { name: 'Prospectos', icon: <Users size={20} />, path: '/prospectos' },
    { name: 'Pipeline', icon: <Kanban size={20} />, path: '/pipeline' },
  ];

  return (
    <div className=\"w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col\">
      <div className=\"p-6 text-2xl font-bold border-b border-gray-800\">
        CULTBRAND CRM
      </div>
      <nav className=\"flex-1 mt-6\">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center px-6 py-4 hover:bg-gray-800 transition-colors ${
              pathname === item.path ? 'bg-gray-800 border-r-4 border-blue-500' : ''
            }`}
          >
            <span className=\"mr-3\">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className=\"p-6 border-t border-gray-800 text-gray-500 text-sm\">
        v1.0.0
      </div>
    </div>
  );
};

export default Sidebar;
