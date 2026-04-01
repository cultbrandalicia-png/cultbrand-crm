'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search } from 'lucide-react';

function getPrioridadBadgeClasses(prioridad?: string | null) {
  if (!prioridad) return 'bg-gray-100 text-gray-800';
  if (prioridad === 'Alta') return 'bg-red-100 text-red-800';
  if (prioridad === 'Media') return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

function getEstadoBadgeClasses(estado?: string | null) {
  if (!estado) return 'bg-gray-100 text-gray-800';
  if (estado === 'Cita agendada') return 'bg-blue-100 text-blue-800';
  if (estado === 'Descartado') return 'bg-red-100 text-red-800';
  if (estado.toLowerCase().includes('enviado')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-emerald-100 text-emerald-800';
}

export default function ProspectosPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProspectos = async () => {
      const { data, error } = await supabase
        .from('prospectos')
        .select('*')
        .order('id', { ascending: true });
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchProspectos();
  }, []);

  const sectores = useMemo(
    () => ['Todos', ...Array.from(new Set((prospectos.map((p) => p.sector).filter(Boolean) as string[])))],
    [prospectos]
  );

  const estados = useMemo(
    () => ['Todos', ...Array.from(new Set((prospectos.map((p) => p.estado).filter(Boolean) as string[])))],
    [prospectos]
  );

  const filteredProspectos = useMemo(() => {
    return prospectos.filter((p) => {
      const matchesSearch =
        p.nombre_empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.persona_contacto && p.persona_contacto.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSector = sectorFilter === 'Todos' || p.sector === sectorFilter;
      const matchesEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
      return matchesSearch && matchesSector && matchesEstado;
    });
  }, [prospectos, searchTerm, sectorFilter, estadoFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Cargando prospectos...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Prospectos
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              {filteredProspectos.length} de {prospectos.length} empresas
            </p>
          </div>
        </header>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar empresa o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {sectores.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {estados.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium">Empresa</th>
                  <th className="px-6 py-3 text-left font-medium">Contacto</th>
                  <th className="px-6 py-3 text-left font-medium">Sector</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                  <th className="px-6 py-3 text-left font-medium">Fase</th>
                  <th className="px-6 py-3 text-left font-medium">Prioridad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProspectos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{p.nombre_empresa}</td>
                    <td className="px-6 py-3 text-gray-500">{p.persona_contacto || '-'}</td>
                    <td className="px-6 py-3 text-gray-500">{p.sector || '-'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadgeClasses(p.estado)}`}>
                        {p.estado || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{p.fase || '-'}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPrioridadBadgeClasses(p.prioridad)}`}>
                        {p.prioridad || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredProspectos.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400 text-xs">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
