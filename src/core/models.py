"""Modelos de datos y esquemas de validación para BodyIndex."""

from enum import Enum
from pydantic import BaseModel, Field, model_validator


class SexoBiologico(str, Enum):
    """Sexo biológico para el cálculo metabólico y de composición corporal."""
    MASCULINO = "masculino"
    FEMENINO = "femenino"

    @classmethod
    def desde_str(cls, valor: str) -> "SexoBiologico":
        v = valor.strip().lower()
        if v in ("m", "masculino", "hombre", "male"):
            return cls.MASCULINO
        if v in ("f", "femenino", "mujer", "female"):
            return cls.FEMENINO
        raise ValueError(f"Sexo no reconocido: '{valor}'. Usa 'm' o 'f'.")


class NivelActividad(str, Enum):
    """Niveles de actividad física con factor PAL (Physical Activity Level) según OMS/FAO."""
    SEDENTARIO = "sedentario"           # 1.200: Poco o nada de ejercicio, trabajo de escritorio
    LIGERO = "ligero"                   # 1.375: Ejercicio ligero 1-3 días por semana
    MODERADO = "moderado"               # 1.550: Ejercicio moderado 3-5 días por semana
    FUERTE = "fuerte"                   # 1.725: Deporte intenso o trabajo físico 6-7 días por semana
    MUY_FUERTE = "muy_fuerte"           # 1.900: Atletas de alto rendimiento o doble sesión diaria

    @property
    def factor_pal(self) -> float:
        factores = {
            self.SEDENTARIO: 1.2,
            self.LIGERO: 1.375,
            self.MODERADO: 1.55,
            self.FUERTE: 1.725,
            self.MUY_FUERTE: 1.9,
        }
        return factores[self]


class ObjetivoCalorico(str, Enum):
    """Objetivos energéticos y de recomposición corporal."""
    DEFICIT_AGRESIVO = "deficit_agresivo"   # -25% de calorías para pérdida rápida (supervisada)
    DEFICIT_MODERADO = "deficit_moderado"   # -15% de calorías para pérdida de grasa sostenible
    MANTENIMIENTO = "mantenimiento"         # 0% de ajuste (equilibrio energético)
    SUPERAVIT_LIGERO = "superavit_ligero"   # +10% de calorías para ganancia muscular limpia
    SUPERAVIT_VOLUMEN = "superavit_volumen" # +15% de calorías para hipertrofia intensa

    @property
    def factor_ajuste(self) -> float:
        ajustes = {
            self.DEFICIT_AGRESIVO: 0.75,
            self.DEFICIT_MODERADO: 0.85,
            self.MANTENIMIENTO: 1.00,
            self.SUPERAVIT_LIGERO: 1.10,
            self.SUPERAVIT_VOLUMEN: 1.15,
        }
        return ajustes[self]


class MetodoTMB(str, Enum):
    """Ecuaciones validadas para la estimación del Metabolismo Basal."""
    AUTO = "auto"                         # Selección inteligente según disponibilidad de grasa corporal
    MIFFLIN_ST_JEOR = "mifflin_st_jeor"   # Ecuación de referencia para población general (1990)
    KATCH_MC_ARDLE = "katch_mc_ardle"     # Basado en masa magra corporal (LBM/FFM)
    OXFORD_HENRY = "oxford_henry"         # Ecuaciones modernas FAO/OMS/UNU (2005)


class PerfilUsuarioInput(BaseModel):
    """Datos de entrada del usuario con validación estricta de límites fisiológicos."""
    edad: int = Field(..., ge=1, le=120, description="Edad en años cumplidos (1 - 120)")
    peso_kg: float = Field(..., ge=2.0, le=500.0, description="Peso corporal en kilogramos (2.0 - 500.0)")
    estatura_m: float = Field(..., ge=0.5, le=2.6, description="Estatura en metros (0.50 - 2.60)")
    sexo: SexoBiologico = Field(..., description="Sexo biológico de nacimiento")
    nivel_actividad: NivelActividad = Field(default=NivelActividad.MODERADO, description="Nivel de actividad física diaria")
    objetivo: ObjetivoCalorico = Field(default=ObjetivoCalorico.MANTENIMIENTO, description="Objetivo calórico y nutricional")
    
    # Parámetros avanzados opcionales
    cintura_cm: float | None = Field(default=None, ge=30.0, le=250.0, description="Circunferencia de cintura en cm (opcional)")
    porcentaje_grasa: float | None = Field(default=None, ge=3.0, le=70.0, description="Porcentaje de grasa corporal estimado (opcional)")
    metodo_tmb_preferido: MetodoTMB = Field(default=MetodoTMB.AUTO, description="Ecuación preferida para TMB")

    @model_validator(mode="after")
    def validar_consistencia(self) -> "PerfilUsuarioInput":
        if self.metodo_tmb_preferido == MetodoTMB.KATCH_MC_ARDLE and self.porcentaje_grasa is None:
            # Si se solicita Katch-McArdle sin porcentaje de grasa, se degradará elegantemente
            pass
        return self


class ResultadoIMC(BaseModel):
    """Resultado del análisis de índice de masa corporal y composición."""
    imc_estandar: float = Field(..., description="IMC clásico de Quetelet (kg/m²)")
    clasificacion_oms: str = Field(..., description="Categoría de peso según la Organización Mundial de la Salud")
    color_semaforo: str = Field(..., description="Código de color visual (verde, amarillo, rojo, azul)")
    nuevo_imc_trefethen: float = Field(..., description="Nuevo IMC de Trefethen (Oxford 2013, exponente 2.5)")
    peso_minimo_saludable_kg: float = Field(..., description="Límite inferior de normopeso (IMC 18.5)")
    peso_maximo_saludable_kg: float = Field(..., description="Límite superior de normopeso (IMC 24.9)")
    
    # Métricas opcionales según datos
    rfm_grasa_estimada: float | None = Field(default=None, description="Masa grasa relativa (RFM Cedars-Sinai 2018)")
    whtr_cintura_estatura: float | None = Field(default=None, description="Índice cintura-estatura (WHtR)")
    riesgo_cardiometabolico: str | None = Field(default=None, description="Evaluación de riesgo por grasa abdominal")


class ResultadoTMB(BaseModel):
    """Resultado de la Tasa Metabólica Basal."""
    tmb_kcal: float = Field(..., description="Calorías consumidas en reposo absoluto (kcal/día)")
    metodo_utilizado: MetodoTMB = Field(..., description="Ecuación matemática aplicada")
    nombre_metodo: str = Field(..., description="Nombre formal del estudio científico")
    masa_magra_kg: float | None = Field(default=None, description="Masa libre de grasa estimada si se proveyó % de grasa")


class DistribucionMacros(BaseModel):
    """Desglose de macronutrientes recomendados."""
    proteinas_g: float = Field(..., description="Gramos diarios de proteína")
    proteinas_kcal: float = Field(..., description="Calorías derivadas de proteínas")
    grasas_g: float = Field(..., description="Gramos diarios de lípidos/grasas saludables")
    grasas_kcal: float = Field(..., description="Calorías derivadas de grasas")
    carbohidratos_g: float = Field(..., description="Gramos diarios de carbohidratos")
    carbohidratos_kcal: float = Field(..., description="Calorías derivadas de carbohidratos")


class ResultadoGET(BaseModel):
    """Resultado del Gasto Energético Total y plan de objetivos."""
    get_mantenimiento_kcal: float = Field(..., description="Calorías diarias para mantener el peso actual")
    tef_estimado_kcal: float = Field(..., description="Efecto térmico estimado de los alimentos (~10% del GET)")
    gasto_actividad_kcal: float = Field(..., description="Gasto atribuible al movimiento y ejercicio físico")
    objetivo_seleccionado: ObjetivoCalorico = Field(..., description="Objetivo calórico aplicado")
    calorias_objetivo_kcal: float = Field(..., description="Meta calórica diaria ajustada según el objetivo")
    diferencia_calorica_kcal: float = Field(..., description="Diferencia respecto al mantenimiento (+/- kcal)")
    macronutrientes: DistribucionMacros = Field(..., description="Distribución de macronutrientes para el objetivo")


class ReporteCompletoBodyIndex(BaseModel):
    """Informe integral consolidado de BodyIndex."""
    perfil: PerfilUsuarioInput
    imc: ResultadoIMC
    tmb: ResultadoTMB
    get: ResultadoGET
    version_motor: str = "2.0.0"
