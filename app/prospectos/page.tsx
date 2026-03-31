'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search, Filter, Edit2 } from 'lucide-react';

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [searchTerm, setSearchBar] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProspectos = async () => {
      const { data, error } = await supabase.from('prospectos').select('*').order('id', { ascending: true });
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchProspectos();
  }, []);

  const filteredProspectos = prospectos.filter(p => {
    const matchesSearch = p.empresa.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (p.contacto && p.contacto.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = sectorFilter === 'Todos' || p.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sectores = ['Todos', ...new Set(prospectos.map(p => p.sector).filter(Boolean))] as string[];

  if (loading) return <div className=\"p-8\">Cargando prospectos...</div>;

  return (
    <div>
      <div className=\"flex justify-between items-center mb-8\">
        <h1 className=\"text-3xl font-bold\">Listado de Prospectos</h1>
        <button className=\"bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors\">
          + Nuevo Prospecto
        </button>
      </div>

      <div className=\"bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex gap-4\">
        <div className=\"flex-1 relative\">
          <Search className=\"absolute left-3 top-3 text-gray-400\" size={20} />
          <input
            type=\"text\"
            placeholder=\"Buscar por empresa o contacto...\"
            className=\"w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500\"
            value={searchTerm}
            onChange={(e) => setSearchBar(e.target.value)}
          />
        </div>
        <div className=\"w-64\">
          <select
            className=\"w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white\"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            {sectores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className=\"bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden\">
        <table className=\"w-full text-left\">
          <thead className=\"bg-gray-50 border-b border-gray-100\">
            <tr>
              <th className=\"px-6 py-4 font-semibold text-gray-600\">Empresa</th>
              <th className=\"px-6 py-4 font-semibold text-gray-600\">Sector</th>
              <th className=\"px-6 py-4 font-semibold text-gray-600\">Contacto</th>
              <th className=\"px-6 py-4 font-semibold text-gray-600\">Estado</th>
              <th className=\"px-6 py-4 font-semibold text-gray-600 text-right\">Acciones</th>
            </tr>
          </thead>
          <tbody className=\"divide-y divide-gray-100\">
            {filteredProspectos.map((prospecto) => (
              <tr key={prospecto.id} className=\"hover:bg-gray-50 transition-colors\">
                <td className=\"px-6 py-4 font-medium text-gray-900\">{prospecto.empresa}</td>
                <td className=\"px-6 py-4 text-gray-500\">{prospecto.sector || '-'}</td>
                <td className=\"px-6 py-4 text-gray-500\">{prospecto.contacto || '-'}</td>
                <td className=\"px-6 py-4\">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    prospecto.estado === 'Cita agendada' ? 'bg-green-100 text-green-700' :
                    prospecto.estado === 'Descartado' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {prospecto.estado}
                  </span>
                </td>
                <td className=\"px-6 py-4 text-right\">
                  <button className=\"text-blue-600 hover:text-blue-800 p-2\">
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
