'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search, Filter, Edit2 } from 'lucide-react';

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
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
    const matchesSearch = p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.persona_contacto && p.persona_contacto.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSector = sectorFilter === 'Todos' || p.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sectores = ['Todos', ...new Set(prospectos.map(p => p.sector).filter(Boolean))] as string[];

  if (loading) return <div className="p-8">Cargando prospectos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Listado de Prospectos</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por empresa o contacto..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            className="pl-10 pr-4 py-2 border rounded-lg appearance-none"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            {sectores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Empresa</th>
              <th className="px-4 py-3 text-left">Contacto</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Sector</th>
              <th className="px-4 py-3 text-left">Fase</th>
              <th className="px-4 py-3 text-left">Prioridad</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProspectos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.nombre_empresa}</td>
                <td className="px-4 py-3 text-gray-600">{p.persona_contacto}</td>
                <td className="px-4 py-3 text-gray-600">{p.email}</td>
                <td className="px-4 py-3 text-gray-600">{p.sector}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {p.fase}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    p.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                    p.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {p.prioridad}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-gray-400 hover:text-blue-600">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProspectos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No se encontraron prospectos.
          </div>
        )}
      </div>
    </div>
  );
}
