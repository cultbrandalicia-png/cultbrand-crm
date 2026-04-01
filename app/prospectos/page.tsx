'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search, Filter } from 'lucide-react';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

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
    () => ['Todos', ...Array.from(new Set(prospectos.map((p) => p.sector).filter((s): s is string => Boolean(s))))],
    [prospectos]
  );

  const estados = useMemo(
    () => ['Todos', ...Array.from(new Set(prospectos.map((p) => p.estado).filter((s): s is string => Boolean(s))))],
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

        <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <Filter size={16} className="text-gray-400" />
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="text-sm text-gray-700 outline-none bg-transparent"
              >
                {sectores.map((s) => (
                  <option key={s} value={s}>{s === 'Todos' ? 'Todos los sectores' : s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
              <Filter size={16} className="text-gray-400" />
              <select
                value={estadoFilter}
                onChange={(e) => setEstadoFilter(e.target.value)}
                className="text-sm text-gray-700 outline-none bg-transparent"
              >
                {estados.map((s) => (
                  <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : s}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresa o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm text-gray-700 outline-none w-56"
            />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="py-3 px-4 text-left">Empresa</th>
                  <th className="py-3 px-4 text-left">Contacto</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Sector</th>
                  <th className="py-3 px-4 text-left">Capa</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Facturacion</th>
                  <th className="py-3 px-4 text-left">BTC</th>
                  <th className="py-3 px-4 text-left">Fase</th>
                  <th className="py-3 px-4 text-left">Prioridad</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">M1</th>
                  <th className="py-3 px-4 text-left">M2</th>
                  <th className="py-3 px-4 text-left">M3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProspectos.length === 0 && (
                  <tr>
                    <td colSpan={14} className="py-6 px-4 text-center text-sm text-gray-500">
                      No se encontraron prospectos.
                    </td>
                  </tr>
                )}
                {filteredProspectos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{p.nombre_empresa}</td>
                    <td className="py-3 px-4 text-gray-600">{p.persona_contacto || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.email || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.sector || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).capa || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).rating || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).facturacion || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).btc || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.fase || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={classNames('inline-flex px-2 py-1 rounded-full text-xs font-medium', getPrioridadBadgeClasses(p.prioridad))}>
                        {p.prioridad || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={classNames('inline-flex px-2 py-1 rounded-full text-xs font-medium', getEstadoBadgeClasses(p.estado))}>
                        {p.estado || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).m1 || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).m2 || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).m3 || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
