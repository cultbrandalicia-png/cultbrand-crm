'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function getEstadoBadgeClasses(estado?: string | null) {
  if (!estado) return 'bg-gray-100 text-gray-800';
  if (estado === 'Cita agendada') return 'bg-blue-100 text-blue-800';
  if (estado === 'Descartado') return 'bg-red-100 text-red-800';
  if (estado.toLowerCase().includes('enviado')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-emerald-100 text-emerald-800';
}

const FASES = [
  'No contactado',
  'M1 enviado',
  'M2 enviado',
  'M3 enviado',
  'Respuesta',
  'Cita agendada',
  'Descartado',
];

export default function PipelinePage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [faseActiva, setFaseActiva] = useState('Todas');

  useEffect(() => {
    const fetchProspectos = async () => {
      const { data, error } = await supabase.from('prospectos').select('*');
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchProspectos();
  }, []);

  const contadores = useMemo(() => {
    return FASES.map((fase) => ({
      fase,
      total: prospectos.filter((p) => p.estado === fase).length,
    }));
  }, [prospectos]);

  const filtrados = useMemo(() => {
    if (faseActiva === 'Todas') return prospectos;
    return prospectos.filter((p) => p.estado === faseActiva);
  }, [prospectos, faseActiva]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Cargando pipeline...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Pipeline de outreach
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {prospectos.length} empresas en el pipeline.
          </p>
        </header>

        {/* Cards resumen por fase */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-6">
          {contadores.map((item) => (
            <article
              key={item.fase}
              className="bg-white rounded-xl shadow-sm border border-gray-100 px-3 py-3 flex flex-col cursor-pointer hover:border-blue-300"
              onClick={() => setFaseActiva(item.fase === faseActiva ? 'Todas' : item.fase)}
            >
              <p className="text-xs font-medium text-gray-500 mb-1 leading-tight">{item.fase}</p>
              <p className="text-2xl font-bold text-gray-900">{item.total}</p>
            </article>
          ))}
        </section>

        {/* Filtros de fase */}
        <section className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFaseActiva('Todas')}
            className={classNames(
              'rounded-full px-3 py-1 text-xs font-medium border',
              faseActiva === 'Todas'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300'
            )}
          >
            Todas
          </button>
          {FASES.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFaseActiva(f)}
              className={classNames(
                'rounded-full px-3 py-1 text-xs font-medium border',
                faseActiva === f
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300'
              )}
            >
              {f}
            </button>
          ))}
        </section>

        {/* Tabla principal */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="py-3 px-4 text-left">Empresa</th>
                  <th className="py-3 px-4 text-left">Contacto</th>
                  <th className="py-3 px-4 text-left">Sector</th>
                  <th className="py-3 px-4 text-left">Capa</th>
                  <th className="py-3 px-4 text-left">Rating</th>
                  <th className="py-3 px-4 text-left">Facturacion</th>
                  <th className="py-3 px-4 text-left">BTC</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">M1</th>
                  <th className="py-3 px-4 text-left">M2</th>
                  <th className="py-3 px-4 text-left">M3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-6 px-4 text-center text-sm text-gray-500">
                      No hay empresas en esta fase.
                    </td>
                  </tr>
                )}
                {filtrados.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{p.nombre_empresa}</td>
                    <td className="py-3 px-4 text-gray-600">{p.persona_contacto || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{p.sector || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).capa || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).rating || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).facturacion || '—'}</td>
                    <td className="py-3 px-4 text-gray-600">{(p as any).btc || '—'}</td>
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
