export type Prospecto = {
  id: number;
  prioridad?: string | null;
  empresa: string;
    nombre_empresa?: string; // alias for empresa
  sector?: string | null;
  sector_resumen?: string | null;
  servicio_sugerido?: string | null;
  contacto?: string | null;
    persona_contacto?: string | null; // alias for contacto
  cargo?: string | null;
  linkedin_empresa?: string | null;
  web?: string | null;
  linkedin_contacto?: string | null;
  oportunidad?: string | null;
  fuentes?: string | null;
  veces_detectada?: number | null;
  tier?: string | null;
  estado?: string | null;
  notas?: string | null;
  creado_en?: string;
  actualizado_en?: string;
};
