'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function getPrioridadBadgeClasses(prioridad?: string | null) {
  if (!prioridad) return 'bg-gray-100 text-gray-800';
  if (prioridad === 'Alta') return 'bg-red-100 text-red-800';
  if (prioridad === 'Media') return 'bg-yellow-100 text-yellow-800';
  return 'bg-green-100 text-green-800';
}

export default function RadarPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [prioridadFilter, setPrioridadFilter] = useState('Todas');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('prospectos')
        .select('*')
        .order('prioridad', { ascending: true });
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtrados = useMemo(() => {
    if (prioridadFilter === 'Todas') return prospectos;
    return prospectos.filter((p) => p.prioridad === prioridadFilter);
  }, [prospectos, prioridadFilter]);

  const contadores = useMemo(() => ({
    alta: prospectos.filter((p) => p.prioridad === 'Alta').length,
    media: prospectos.filter((p) => p.prioridad === 'Media').length,
    baja: prospectos.filter((p) => p.prioridad === 'Baja').length,
  }), [prospectos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Cargando radar...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inteligencia · Radar
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Empresas en radar estrategico ordenadas por prioridad.
          </p>
        </header>

        {/* Stats por prioridad */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <article
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:border-red-300"
            onClick={() => setPrioridadFilter(prioridadFilter === 'Alta' ? 'Todas' : 'Alta')}
          >
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Prioridad Alta</p>
            <p className="text-3xl font-bold text-red-600">{contadores.alta}</p>
          </article>
          <article
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:border-yellow-300"
            onClick={() => setPrioridadFilter(prioridadFilter === 'Media' ? 'Todas' : 'Media')}
          >
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Prioridad Media</p>
            <p className="text-3xl font-bold text-yellow-600">{contadores.media}</p>
          </article>
          <article
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:border-green-300"
            onClick={() => setPrioridadFilter(prioridadFilter === 'Baja' ? 'Todas' : 'Baja')}
          >
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Prioridad Baja</p>
            <p className="text-3xl font-bold text-green-600">{contadores.baja}</p>
          </article>
        </section>

        {/* Filtros */}
        <section className="mb-4 flex flex-wrap gap-2">
          {['Todas', 'Alta', 'Media', 'Baja'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setPrioridadFilter(f)}
              className={classNames(
                'rounded-full px-3 py-1 text-xs font-medium border',
                prioridadFilter === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              )}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Tabla */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="py-3 px-4 text-left">Empresa</th>
                  <th className="py-3 px-4 text-left">Sector</th>
                  <th className="py-3 px-4 text-left">Capa</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Contacto</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">Prioridad</th>
                  <th className="py-3 px-4 text-left">Notas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-6 px-4 text-center text-sm text-gray-500">
                      No hay empresas en radar con esta prioridad.
                    </td>
                  </tr>
                )}
                {filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{p.nombre_empresa}</td>
                    <td className="py-3 px-4 text-gray-600">{p.sector || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).capa || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).rating || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.persona_contacto || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.estado || '—'}</td>
                    <td className="py-3 px-4">
                      <span className={classNames('inline-flex px-2 py-1 rounded-full text-xs font-medium', getPrioridadBadgeClasses(p.prioridad))}>
                        {p.prioridad || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).notas || '—'}</td>
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
