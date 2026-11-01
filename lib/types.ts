export type SexoBiologico = "masculino" | "femenino";

export type NivelActividad =
  | "sedentario"
  | "ligero"
  | "moderado"
  | "fuerte"
  | "muy_fuerte";

export type ObjetivoCalorico =
  | "deficit_agresivo"
  | "deficit_moderado"
  | "mantenimiento"
  | "superavit_ligero"
  | "superavit_volumen";

export type MetodoTMB =
  | "auto"
  | "mifflin_st_jeor"
  | "katch_mc_ardle"
  | "oxford_henry";

export interface UserProfile {
  edad: number;
  peso_kg: number;
  estatura_m: number;
  sexo: SexoBiologico;
  nivel_actividad: NivelActividad;
  objetivo: ObjetivoCalorico;
  cintura_cm?: number;
  porcentaje_grasa?: number;
  metodo_tmb_preferido?: MetodoTMB;
}

export interface ResultadoIMC {
  imc_estandar: number;
  clasificacion_oms: string;
  color_semaforo: string;
  nuevo_imc_trefethen: number;
  peso_minimo_saludable_kg: number;
  peso_maximo_saludable_kg: number;
  rfm_grasa_estimada?: number | null;
  whtr_cintura_estatura?: number | null;
  riesgo_cardiometabolico?: string | null;
}

export interface ResultadoTMB {
  tmb_kcal: number;
  metodo_utilizado: MetodoTMB;
  nombre_metodo: string;
  masa_magra_kg?: number | null;
}

export interface DistribucionMacros {
  proteinas_g: number;
  proteinas_kcal: number;
  grasas_g: number;
  grasas_kcal: number;
  carbohidratos_g: number;
  carbohidratos_kcal: number;
}

export interface ResultadoGET {
  get_mantenimiento_kcal: number;
  tef_estimado_kcal: number;
  gasto_actividad_kcal: number;
  objetivo_seleccionado: ObjetivoCalorico;
  calorias_objetivo_kcal: number;
  diferencia_calorica_kcal: number;
  macronutrientes: DistribucionMacros;
}

export interface CalculationReport {
  perfil: UserProfile;
  imc: ResultadoIMC;
  tmb: ResultadoTMB;
  get: ResultadoGET;
}
