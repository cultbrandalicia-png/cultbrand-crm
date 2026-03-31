'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Prospecto } from '@/types';

const estados = ['No contactado', 'M1 enviado', 'M2 enviado', 'M3 enviado', 'Respuesta', 'Cita agendada', 'Descartado'];

export default function PipelinePage() {
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProspectos = async () => {
      const { data, error } = await supabase.from('prospectos').select('*');
      if (!error && data) setProspectos(data);
      setLoading(false);
    };
    fetchProspectos();
  }, []);

  if (loading) return <div className=\"p-8\">Cargando pipeline...</div>;

  return (
    <div className=\"h-full\">
      <h1 className=\"text-3xl font-bold mb-8\">Pipeline de Ventas</h1>
      <div className=\"flex gap-4 overflow-x-auto pb-8 h-[calc(100vh-200px)]\">
        {estados.map((estado) => (
          <div key={estado} className=\"flex-shrink-0 w-80 bg-gray-100 rounded-xl flex flex-col\">
            <div className=\"p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl\">
              <h2 className=\"font-bold text-gray-700\">{estado}</h2>
              <span className=\"bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs\">
                {prospectos.filter(p => p.estado === estado).length}
              </span>
            </div>
            <div className=\"flex-1 p-3 space-y-3 overflow-y-auto\">
              {prospectos
                .filter((p) => p.estado === estado)
                .map((prospecto) => (
                  <div key={prospecto.id} className=\"bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow\">
                    <h3 className=\"font-semibold text-gray-900 mb-1\">{prospecto.empresa}</h3>
                    <p className=\"text-sm text-gray-500 line-clamp-1\">{prospecto.contacto || 'Sin contacto'}</p>
                    <div className=\"mt-3 flex justify-between items-center\">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${
                        prospecto.prioridad === 'Alta' ? 'bg-red-100 text-red-600' :
                        prospecto.prioridad === 'Media' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {prospecto.prioridad || 'Media'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
