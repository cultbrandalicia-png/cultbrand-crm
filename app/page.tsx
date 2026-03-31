'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('prospectos').select('*');
      if (!error && data) {
        setProspectos(data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const stats = [
    { name: 'Total Prospectos', value: prospectos.length, icon: <Users />, color: 'bg-blue-500' },
    { name: 'Citas Agendadas', value: prospectos.filter(p => p.estado === 'Cita agendada').length, icon: <CheckCircle />, color: 'bg-green-500' },
    { name: 'En Seguimiento', value: prospectos.filter(p => p.estado && p.estado.includes('enviado')).length, icon: <Clock />, color: 'bg-yellow-500' },
    { name: 'Descartados', value: prospectos.filter(p => p.estado === 'Descartado').length, icon: <XCircle />, color: 'bg-red-500' },
  ];

  if (loading) return <div className="p-8">Cargando dashboard...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard de Prospectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-gray-500 text-sm">{stat.name}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold mb-4">Prospectos recientes</h2>
        <table className="w-full text-sm">
          <thead className="text-gray-500 uppercase text-xs border-b">
            <tr>
              <th className="py-3 text-left">Empresa</th>
              <th className="py-3 text-left">Contacto</th>
              <th className="py-3 text-left">Fase</th>
              <th className="py-3 text-left">Prioridad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {prospectos.slice(0, 10).map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="py-3 font-medium">{p.nombre_empresa}</td>
                <td className="py-3 text-gray-600">{p.persona_contacto}</td>
                <td className="py-3">
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{p.fase}</span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    p.prioridad === 'Alta' ? 'bg-red-100 text-red-800' :
                    p.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>{p.prioridad}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
