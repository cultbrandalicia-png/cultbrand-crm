'use client';
import { useEffect, useState, useMemo } from 'react';
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
  if (f.toLowerCase().includes('enviado')) return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (f === 'Respuesta') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
  return 'bg-gray-100 text-gray-500 border border-gray-200';
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
    { label: 'Total empresas', value: prospectos.length, icon: '\uD83C\uDFE2', color: 'from-blue-500 to-blue-600', light: 'bg-blue-50 text-blue-600' },
    { label: 'Citas agendadas', value: prospectos.filter(p => p.estado === 'Cita agendada').length, icon: '\uD83D\uDCC5', color: 'from-emerald-500 to-emerald-600', light: 'bg-emerald-50 text-emerald-600' },
    { label: 'En outreach', value: prospectos.filter(p => p.estado && p.estado.toLowerCase().includes('enviado')).length, icon: '\uD83D\uDCE4', color: 'from-amber-500 to-amber-600', light: 'bg-amber-50 text-amber-600' },
    { label: 'Descartados', value: prospectos.filter(p => p.estado === 'Descartado').length, icon: '\u274C', color: 'from-red-500 to-red-600', light: 'bg-red-50 text-red-600' },
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
    return prospectos.filter(p => p.prioridad === 'Alta').slice(0, 10);
  }, [prospectos]);

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

  const total = prospectos.length;

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
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${s.light}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two column row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pipeline por fase */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Pipeline de outreach</h2>
          <div className="space-y-3">
            {porFase.map(({ fase, total: t }) => {
              const pct = total > 0 ? Math.round((t / total) * 100) : 0;
              return (
                <div key={fase}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{fase}</span>
                    <span className="text-sm font-semibold text-gray-900">{t} <span className="font-normal text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Por sector */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Por sector</h2>
          <div className="space-y-3">
            {porSector.length === 0 && <p className="text-sm text-gray-400">Sin datos de sector</p>}
            {porSector.map(([sector, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={sector}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{sector}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} <span className="font-normal text-gray-400">({pct}%)</span></span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 10 mayor prioridad */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Top 10 &middot; Mayor prioridad</h2>
          <Link href="/prospectos" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Ver todos</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">Empresa</th>
                <th className="px-6 py-3 text-left font-medium">Contacto</th>
                <th className="px-6 py-3 text-left font-medium">Sector</th>
                <th className="px-6 py-3 text-left font-medium">Fase</th>
                <th className="px-6 py-3 text-left font-medium">Prioridad</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {top10.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-900">{p.nombre_empresa}</td>
                  <td className="px-6 py-3.5 text-gray-600">{p.persona_contacto || '-'}</td>
                  <td className="px-6 py-3.5 text-gray-600">{p.sector || '-'}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFaseBadge(p.fase || p.estado)}`}>
                      {p.fase || p.estado || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPrioridadBadge(p.prioridad)}`}>
                      {p.prioridad || '-'}
                    </span>
                  </td>
                </tr>
              ))}
              {top10.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">No hay empresas de alta prioridad</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
