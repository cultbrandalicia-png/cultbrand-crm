'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import Link from 'next/link';

const FASES = ['No contactado','M1 enviado','M2 enviado','M3 enviado','Respuesta','Cita agendada','Descartado'];

function getPrioridadBadge(p?: string | null) {
  if (p === 'Alta') return 'bg-red-100 text-red-700 border border-red-200';
  if (p === 'Media') return 'bg-amber-100 text-amber-700 border border-amber-200';
  return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
}

function getFaseBadge(f?: string | null) {
  if (!f) return 'bg-gray-100 text-gray-500 border border-gray-200';
  if (f === 'Cita agendada') return 'bg-blue-100 text-blue-700 border border-blue-200';
  if (f === 'Descartado') return 'bg-red-100 text-red-700 border border-red-200';
  if (f.toLowerCase().includes('enviado')) return 'bg-amber-100 text-amber-700 border border-amber-700';
  if (f === 'Respuesta') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  return 'bg-gray-100 text-gray-500 border border-gray-200';
}

export default function Dashboard() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('prospectos_mix').select('+');
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = (() => {
    return {
      total: { label: 'Total empresas', value: prospectos.length, icon: '\uD83C\uDFE2', color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
      citas: { label: 'Citas agendadas', value: prospectos.filter(p => p.estado === 'Cita agendada').length, icon: '\uD83D\uDCC5', color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
      enOutreach: { label: 'En outreach', value: prospectos.filter(p => p.estado && p.estado.toLowerCase().includes('enviado')).length, icon: '\uD83D\uDCE4', color: 'from-orange-500 to-orange-600', light: 'bg-orange-50 text-orange-600' },
      descartados: { label: 'Descartados', value: prospectos.filter(p => p.estado === 'Descartado').length, icon: '\u274C', color: 'from-red-500 to-red-600', light: 'bg-red-50 text-red-600' }
    };
  })();

  const porSector = (() => {
    const map: Record<string, number> = {};
    prospectos.forEach(p => {
      if (p.sector) map[p.sector] = (map[p.sector] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  })();

  const porFase = (() => {
    return FASES.map(fase => ({
      fase,
      total: prospectos.filter(p => p.estado === fase).length,
    }));
  })();

  const top10 = (() => {
    return prospectos.filter(p => p.prioridad === 'Alta').slice(0, 10);
  })();

  const total = prospectos.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm font-medium">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} empresas en el CRM</p>
        </div>
        <Link
          href="/prospectos"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver todos
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.values(stats).map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.light}`}>
              {s.label}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por Sector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Por Sector</h2>
          <div className="space-y-3">
            {porSector.map(([sector, count]) => {
              const pct = ((count / total) * 100).toFixed(0);
              return (
                <div key={sector}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{sector}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por Fase */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Por Fase</h2>
          <div className="space-y-3">
            {porFase.map(({ fase, total: count }) => {
              const pct = ((count / total) * 100).toFixed(0);
              return (
                <div key={fase}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{fase}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 10 Priority */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top 10 Prioridad Alta</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Empresa</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Sector</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Prioridad</th>
              </tr>
            </thead>
            <tbody>
              {top10.map((p, idx) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <Link href={`/prospectos/${p.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{p.sector}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getFaseBadge(p.estado)}`}>
                      {p.estado || 'Sin estado'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getPrioridadBadge(p.prioridad)}`}>
                      {p.prioridad}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
