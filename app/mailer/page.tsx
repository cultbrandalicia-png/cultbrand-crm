'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Search } from 'lucide-react';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

function getEstadoBadgeClasses(estado?: string | null) {
  if (!estado) return 'bg-gray-100 text-gray-800';
  if (estado.toLowerCase().includes('activ')) return 'bg-emerald-100 text-emerald-800';
  if (estado.toLowerCase().includes('enviado')) return 'bg-yellow-100 text-yellow-800';
  if (estado === 'Descartado') return 'bg-red-100 text-red-800';
  return 'bg-blue-100 text-blue-800';
}

export default function MailerPage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('prospectos')
        .select('*')
        .not('estado', 'is', null)
        .order('nombre_empresa', { ascending: true });
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtrados = useMemo(() => {
    if (!search) return prospectos;
    return prospectos.filter((p) =>
      p.nombre_empresa.toLowerCase().includes(search.toLowerCase()) ||
      (p.persona_contacto && p.persona_contacto.toLowerCase().includes(search.toLowerCase()))
    );
  }, [prospectos, search]);

  const stats = useMemo(() => ({
    total: prospectos.length,
    m1: prospectos.filter((p) => (p as any).m1).length,
    m2: prospectos.filter((p) => (p as any).m2).length,
    m3: prospectos.filter((p) => (p as any).m3).length,
  }), [prospectos]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Cargando MailerLite...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Inteligencia · MailerLite
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Secuencias de email por empresa, con seguimiento de mensajes M1, M2 y M3.
          </p>
        </header>

        {/* Stats de cobertura */}
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
            <p className="text-3xl font-bold text-yellow-600">{stats.m2}</p>
          </article>
          <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Con M3</p>
            <p className="text-3xl font-bold text-emerald-600">{stats.m3}</p>
          </article>
        </section>

        {/* Buscador */}
        <section className="mb-4">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm w-full sm:w-72">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar empresa o contacto..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="text-sm text-gray-700 outline-none flex-1"
            />
          </div>
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
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Estado</th>
                  <th className="py-3 px-4 text-left">M1</th>
                  <th className="py-3 px-4 text-left">M2</th>
                  <th className="py-3 px-4 text-left">M3</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-6 px-4 text-center text-sm text-gray-500">
                      No hay empresas en secuencia todavia.
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
                    <td className="py-3 px-4 text-gray-600">{p.email || '—'}</td>
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
