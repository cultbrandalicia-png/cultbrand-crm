'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search } from 'lucide-react';

function getEstadoBadgeClasses(estado?: string | null) {
  if (!estado) return 'bg-gray-100 text-gray-800';
  if (estado === 'Cita agendada') return 'bg-blue-100 text-blue-800';
  if (estado === 'Descartado') return 'bg-red-100 text-red-800';
  if (estado.toLowerCase().includes('enviado')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-emerald-100 text-emerald-800';
}

export default function LinkedInPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from()
        .select('*')
        .order('nombre_empresa', { ascending: true });
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const estados = useMemo(
    () => ['Todos', ...Array.from(new Set(prospectos.map((p) => p.estado).filter(Boolean) as string[]))],
    [prospectos]
  );

  const filtrados = useMemo(() => {
    return prospectos.filter((p) => {
      const matchSearch =
        !search ||
        p.empresa.toLowerCase().includes(search.toLowerCase()) ||
        (p.contacto && p.contacto.toLowerCase().includes(search.toLowerCase()));
      const matchEstado = estadoFilter === 'Todos' || p.estado === estadoFilter;
      return matchSearch && matchEstado;
    });
  }, [prospectos, search, estadoFilter]);

  const stats = useMemo(() => ({
    total: prospectos.length,
    m1: prospectos.filter((p) => (p as any).m1).length,
    m2: prospectos.filter((p) => (p as any).m2).length,
    m3: prospectos.filter((p) => (p as any).m3).length,
  }), [prospectos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Cargando LinkedIn...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inteligencia · LinkedIn
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Maquina de outreach en LinkedIn. Seguimiento de M1, M2 y M3 por empresa.
          </p>
        </header>

        {/* Stats cobertura */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Total empresas</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </article>
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Con M1</p>
            <p className="text-3xl font-bold text-blue-600">{stats.m1}</p>
          </article>
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Con M2</p>
            <p className="text-3xl font-bold text-blue-600">{stats.m2}</p>
          </article>
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Con M3</p>
            <p className="text-3xl font-bold text-blue-600">{stats.m3}</p>
          </article>
        </section>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar empresa o contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {estados.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm text-gray-500">{filtrados.length} de {prospectos.length} empresas</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-3 text-left font-medium">Empresa</th>
                  <th className="px-6 py-3 text-left font-medium">Contacto</th>
                  <th className="px-6 py-3 text-left font-medium">LinkedIn</th>
                  <th className="px-6 py-3 text-left font-medium">M1</th>
                  <th className="px-6 py-3 text-left font-medium">M2</th>
                  <th className="px-6 py-3 text-left font-medium">M3</th>
                  <th className="px-6 py-3 text-left font-medium">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900">{p.empresa}</td>
                    <td className="px-6 py-3 text-gray-500">{p.contacto || '-'}</td>
                    <td className="px-6 py-3">
                      {(p as any).linkedin_url ? (
                        <a href={(p as any).linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs">Ver perfil</a>
                      ) : <span className="text-gray-300">-</span>}
                    </td>
                    <td className="px-6 py-3">
                      {(p as any).m1 ? <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> : <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
                    </td>
                    <td className="px-6 py-3">
                      {(p as any).m2 ? <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> : <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
                    </td>
                    <td className="px-6 py-3">
                      {(p as any).m3 ? <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> : <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadgeClasses(p.estado)}`}>
                        {p.estado || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400 text-xs">Sin resultados</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
