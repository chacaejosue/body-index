"""Punto de entrada de FastAPI y funciones Serverless para Vercel."""

import sys
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Asegurar importación de módulos del proyecto tanto en local como en Vercel Serverless
raiz_proyecto = Path(__file__).resolve().parent.parent
if str(raiz_proyecto) not in sys.path:
    sys.path.insert(0, str(raiz_proyecto))

from src.core.models import (
    PerfilUsuarioInput,
    SexoBiologico,
    NivelActividad,
    ObjetivoCalorico,
    MetodoTMB,
    ResultadoIMC,
    ResultadoTMB,
    ResultadoGET,
    ReporteCompletoBodyIndex,
)
from src.core.calculadora import generar_reporte_completo
from src.core.imc import analizar_imc
from src.core.tmb import calcular_tmb
from src.core.get import calcular_gasto_energetico

app = FastAPI(
    title="BodyIndex API",
    description="API REST de alto rendimiento para cálculos antropométricos, metabólicos y nutricionales.",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Configuración de seguridad CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción con dominio específico se puede restringir
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# Esquemas específicos para endpoints unitarios
class IMCRequest(BaseModel):
    peso_kg: float = Field(..., ge=2.0, le=500.0)
    estatura_m: float = Field(..., ge=0.5, le=2.6)
    sexo: SexoBiologico
    cintura_cm: float | None = Field(default=None, ge=30.0, le=250.0)


class TMBRequest(BaseModel):
    peso_kg: float = Field(..., ge=2.0, le=500.0)
    estatura_m: float = Field(..., ge=0.5, le=2.6)
    edad: int = Field(..., ge=1, le=120)
    sexo: SexoBiologico
    porcentaje_grasa: float | None = Field(default=None, ge=3.0, le=70.0)
    metodo_preferido: MetodoTMB = Field(default=MetodoTMB.AUTO)


class GETRequest(BaseModel):
    tmb_kcal: float = Field(..., ge=200.0, le=10000.0)
    peso_kg: float = Field(..., ge=2.0, le=500.0)
    nivel_actividad: NivelActividad = Field(default=NivelActividad.MODERADO)
    objetivo: ObjetivoCalorico = Field(default=ObjetivoCalorico.MANTENIMIENTO)


@app.get("/api/health", tags=["Salud"])
def health_check():
    """Comprobación de estado y versión del servicio."""
    return {
        "status": "online",
        "service": "BodyIndex API",
        "version": "2.0.0",
        "engine": "Python 3.11",
    }


@app.post("/api/v1/imc", response_model=ResultadoIMC, tags=["Cálculos"])
def endpoint_imc(data: IMCRequest):
    """Calcula IMC estándar, nuevo IMC Trefethen y métricas opcionales (RFM, WHtR)."""
    try:
        return analizar_imc(
            peso_kg=data.peso_kg,
            estatura_m=data.estatura_m,
            sexo=data.sexo,
            cintura_cm=data.cintura_cm,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/v1/tmb", response_model=ResultadoTMB, tags=["Cálculos"])
def endpoint_tmb(data: TMBRequest):
    """Calcula la Tasa Metabólica Basal mediante Mifflin-St Jeor, Katch-McArdle u Oxford."""
    try:
        return calcular_tmb(
            peso_kg=data.peso_kg,
            estatura_m=data.estatura_m,
            edad=data.edad,
            sexo=data.sexo,
            porcentaje_grasa=data.porcentaje_grasa,
            metodo_preferido=data.metodo_preferido,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/v1/get", response_model=ResultadoGET, tags=["Cálculos"])
def endpoint_get(data: GETRequest):
    """Calcula el Gasto Energético Total (GET) y distribución de macronutrientes."""
    try:
        return calcular_gasto_energetico(
            tmb_kcal=data.tmb_kcal,
            peso_kg=data.peso_kg,
            nivel_actividad=data.nivel_actividad,
            objetivo=data.objetivo,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/v1/analisis-completo", response_model=ReporteCompletoBodyIndex, tags=["Cálculos"])
def endpoint_analisis_completo(perfil: PerfilUsuarioInput):
    """Procesa el perfil completo del usuario y genera el informe consolidado BodyIndex."""
    try:
        return generar_reporte_completo(perfil)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
