"""Fachada principal para el cálculo consolidado del reporte BodyIndex."""

from .models import (
    PerfilUsuarioInput,
    ReporteCompletoBodyIndex,
    MetodoTMB,
    SexoBiologico,
)
from .imc import analizar_imc
from .tmb import calcular_tmb
from .get import calcular_gasto_energetico


def generar_reporte_completo(perfil: PerfilUsuarioInput) -> ReporteCompletoBodyIndex:
    """Ejecuta el pipeline integral de análisis antropométrico, metabólico y energético."""
    resultado_imc = analizar_imc(
        peso_kg=perfil.peso_kg,
        estatura_m=perfil.estatura_m,
        sexo=perfil.sexo,
        cintura_cm=perfil.cintura_cm,
    )

    # Determinar porcentaje de grasa efectivo para Katch-McArdle si no se ingresó directamente
    grasa_efectiva = perfil.porcentaje_grasa
    if grasa_efectiva is None and resultado_imc.rfm_grasa_estimada is not None:
        grasa_efectiva = resultado_imc.rfm_grasa_estimada
    elif grasa_efectiva is None and perfil.metodo_tmb_preferido == MetodoTMB.KATCH_MC_ARDLE:
        grasa_efectiva = 15.0 if perfil.sexo == SexoBiologico.MASCULINO else 23.0

    resultado_tmb = calcular_tmb(
        peso_kg=perfil.peso_kg,
        estatura_m=perfil.estatura_m,
        edad=perfil.edad,
        sexo=perfil.sexo,
        porcentaje_grasa=grasa_efectiva,
        metodo_preferido=perfil.metodo_tmb_preferido,
    )

    resultado_get = calcular_gasto_energetico(
        tmb_kcal=resultado_tmb.tmb_kcal,
        peso_kg=perfil.peso_kg,
        nivel_actividad=perfil.nivel_actividad,
        objetivo=perfil.objetivo,
    )

    return ReporteCompletoBodyIndex(
        perfil=perfil,
        imc=resultado_imc,
        tmb=resultado_tmb,
        get=resultado_get,
    )
