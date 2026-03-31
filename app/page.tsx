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
    { name: 'En Seguimiento', value: prospectos.filter(p => p.estado.includes('enviado')).length, icon: <Clock />, color: 'bg-yellow-500' },
    { name: 'Descartados', value: prospectos.filter(p => p.estado === 'Descartado').length, icon: <XCircle />, color: 'bg-red-500' },
  ];

  if (loading) return <div className=\"p-8\">Cargando dashboard...</div>;

  return (
    <div>
      <h1 className=\"text-3xl font-bold mb-8\">Dashboard de Prospectos</h1>
      <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
        {stats.map((stat) => (
          <div key={stat.name} className=\"bg-white p-6 rounded-xl shadow-sm border border-gray-100\">
            <div className=\"flex items-center justify-between mb-4\">
              <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <span className=\"text-2xl font-bold text-gray-800\">{stat.value}</span>
            </div>
            <h3 className=\"text-gray-500 font-medium\">{stat.name}</h3>
          </div>
        ))}
      </div>
      
      <div className=\"mt-12 bg-white p-8 rounded-xl shadow-sm border border-gray-100\">
        <h2 className=\"text-xl font-bold mb-6\">Últimos movimientos</h2>
        <p className=\"text-gray-500\">Aquí aparecerán las últimas actualizaciones de tus prospectos.</p>
      </div>
    </div>
  );
}
