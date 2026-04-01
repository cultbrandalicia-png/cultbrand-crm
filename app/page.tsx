'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import Link from 'next/link';

const FASES = ['No contactado','M1 enviado','M2 enviado','M3 enviado','Respuesta','Cita agendada','Descartado'];

function getPrioridadColor(p?: string | null) {
  if (p === 'Alta') return 'bg-red-100 text-red-700';
  if (p === 'Media') return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
}

function getFaseColor(f?: string | null) {
  if (!f) return 'bg-gray-100 text-gray-600';
  if (f === 'Cita agendada') return 'bg-blue-100 text-blue-700';
  if (f === 'Descartado') return 'bg-red-100 text-red-700';
  if (f.toLowerCase().includes('enviado')) return 'bg-yellow-100 text-yellow-700';
  if (f === 'Respuesta') return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-600';
}

export default function Dashboard() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('prospectos').select('*');
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = useMemo(() => [
    { label: 'Total empresas', value: prospectos.length, color: 'bg-blue-600' },
    { label: 'Citas agendadas', value: prospectos.filter(p => p.estado === 'Cita agendada').length, color: 'bg-emerald-600' },
    { label: 'En outreach', value: prospectos.filter(p => p.estado && p.estado.toLowerCase().includes('enviado')).length, color: 'bg-yellow-500' },
    { label: 'Descartados', value: prospectos.filter(p => p.estado === 'Descartado').length, color: 'bg-red-500' },
  ], [prospectos]);

  const porSector = useMemo(() => {
    const map: Record<string, number> = {};
    prospectos.forEach(p => { if (p.sector) map[p.sector] = (map[p.sector] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [prospectos]);

  const porFase = useMemo(() => {
    return FASES.map(fase => ({
      fase,
      total: prospectos.filter(p => p.estado === fase).length,
    }));
  }, [prospectos]);

  const top10 = useMemo(() => {
    return prospectos
      .filter(p => p.prioridad === 'Alta')
      .slice(0, 10);
  }, [prospectos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-400 text-sm">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">{prospectos.length} empresas en el CRM</p>
        </div>

        {/* KPI Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col gap-2">
              <div className={`w-2 h-2 rounded-full ${s.color}`} />
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{s.label}</div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Pipeline por fase */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Pipeline de outreach</h2>
            <div className="space-y-3">
              {porFase.map(({ fase, total }) => {
                const pct = prospectos.length > 0 ? Math.round((total / prospectos.length) * 100) : 0;
                return (
                  <div key={fase}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">{fase}</span>
                      <span>{total} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Por sector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Por sector</h2>
            <div className="space-y-2">
              {porSector.map(([sector, count]) => (
                <div key={sector} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-[140px]">{sector}</span>
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{count}</span>
                </div>
              ))}
              {porSector.length === 0 && <p className="text-xs text-gray-400">Sin datos de sector</p>}
            </div>
          </div>
        </div>

        {/* Top 10 mayor prioridad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Top 10 · Mayor prioridad</h2>
            <Link href="/prospectos" className="text-xs text-blue-600 hover:underline">Ver todos</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-400 uppercase border-b border-gray-100">
                  <th className="pb-3 text-left font-medium">Empresa</th>
                  <th className="pb-3 text-left font-medium">Contacto</th>
                  <th className="pb-3 text-left font-medium">Sector</th>
                  <th className="pb-3 text-left font-medium">Fase</th>
                  <th className="pb-3 text-left font-medium">Prioridad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {top10.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-gray-900">{p.nombre_empresa}</td>
                    <td className="py-3 text-gray-500">{p.persona_contacto || '-'}</td>
                    <td className="py-3 text-gray-500">{p.sector || '-'}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getFaseColor(p.fase || p.estado)}`}>
                        {p.fase || p.estado || '-'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPrioridadColor(p.prioridad)}`}>
                        {p.prioridad || '-'}
                      </span>
                    </td>
                  </tr>
                ))}
                {top10.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-gray-400 text-xs">Sin prospectos de alta prioridad</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
