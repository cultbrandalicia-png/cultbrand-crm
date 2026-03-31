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

  const sectores = ['Todos', ...Array.from(new Set(prospectos.map(p => p.sector).filter((s): s is string => Boolean(s))))];

  if (loading) return <div className="p-8">Cargando prospectos...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Listado de Prospectos</h1>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2 flex-1">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Buscar empresa o contacto..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="outline-none flex-1"
          />
        </div>
        <div className="flex items-center gap-2 bg-white border rounded-lg px-4 py-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="outline-none"
          >
            {sectores.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <table className="w-full text-sm">
          <thead className="text-gray-500 uppercase text-xs border-b">
            <tr>
              <th className="py-3 text-left px-4">Empresa</th>
              <th className="py-3 text-left px-4">Contacto</th>
              <th className="py-3 text-left px-4">Email</th>
              <th className="py-3 text-left px-4">Sector</th>
              <th className="py-3 text-left px-4">Fase</th>
              <th className="py-3 text-left px-4">Prioridad</th>
              <th className="py-3 text-left px-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredProspectos.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{p.nombre_empresa}</td>
                <td className="py-3 px-4 text-gray-600">{p.persona_contacto}</td>
                <td className="py-3 px-4 text-gray-600">{p.email}</td>
                <td className="py-3 px-4 text-gray-600">{p.sector}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{p.fase}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    p.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                    p.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>{p.prioridad}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">{p.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProspectos.length === 0 && (
          <div className="p-8 text-center text-gray-500">No se encontraron prospectos</div>
        )}
      </div>
    </div>
  );
}
