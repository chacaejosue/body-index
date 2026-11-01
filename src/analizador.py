"""CLI interactiva de BodyIndex v2 - Analizador de métricas corporales."""

import sys
from pathlib import Path

# Asegurar importación de 'src' cuando se ejecuta directamente python src/analizador.py
raiz_proyecto = Path(__file__).resolve().parent.parent
if str(raiz_proyecto) not in sys.path:
    sys.path.insert(0, str(raiz_proyecto))

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from src.core.models import (
    PerfilUsuarioInput,
    SexoBiologico,
    NivelActividad,
    ObjetivoCalorico,
)
from src.core.calculadora import generar_reporte_completo


def pedir_float(mensaje: str, minimo: float | None = None, maximo: float | None = None) -> float:
    """Solicita un número decimal validando rango y tipo."""
    while True:
        try:
            valor = float(input(mensaje).strip().replace(",", "."))
            if minimo is not None and valor < minimo:
                print(f"Error: El valor debe ser mayor o igual a {minimo}.")
                continue
            if maximo is not None and valor > maximo:
                print(f"Error: El valor debe ser menor o igual a {maximo}.")
                continue
            return valor
        except ValueError:
            print("Error: Entrada inválida. Introduce un valor numérico.")


def pedir_int(mensaje: str, minimo: int | None = None, maximo: int | None = None) -> int:
    """Solicita un número entero validando rango y tipo."""
    while True:
        try:
            valor = int(input(mensaje).strip())
            if minimo is not None and valor < minimo:
                print(f"Error: El número debe ser mayor o igual a {minimo}.")
                continue
            if maximo is not None and valor > maximo:
                print(f"Error: El número debe ser menor o igual a {maximo}.")
                continue
            return valor
        except ValueError:
            print("Error: Entrada inválida. Introduce un número entero.")


def pedir_sexo() -> SexoBiologico:
    """Solicita y valida el sexo biológico."""
    while True:
        entrada = input("Introduce tu sexo biológico (M para Masculino / F para Femenino): ").strip()
        try:
            return SexoBiologico.desde_str(entrada)
        except ValueError:
            print("Error: Opción inválida. Usa 'M' o 'F'.")


def analizador():
    """Flujo interactivo de la aplicación de consola."""
    print("=" * 60)
    print("       BIENVENIDO AL ANALIZADOR CIENTÍFICO BODYINDEX v2       ")
    print("=" * 60)

    sexo = pedir_sexo()
    edad = pedir_int("Introduce tu edad (años): ", minimo=1, maximo=120)
    peso = pedir_float("Introduce tu peso (kg): ", minimo=2.0, maximo=500.0)
    estatura = pedir_float("Introduce tu estatura (metros, ej: 1.75): ", minimo=0.5, maximo=2.6)

    # Opciones avanzadas opcionales
    incluir_avanzado = input("\n¿Deseas ingresar medidas adicionales (cintura, % grasa)? (s/N): ").strip().lower() == "s"
    cintura: float | None = None
    grasa: float | None = None

    if incluir_avanzado:
        cintura = pedir_float("Circunferencia de cintura (cm, ej: 82.0): ", minimo=30.0, maximo=250.0)
        sabe_grasa = input("¿Conoces tu porcentaje de grasa corporal? (s/N): ").strip().lower() == "s"
        if sabe_grasa:
            grasa = pedir_float("Porcentaje de grasa corporal (%): ", minimo=3.0, maximo=70.0)

    # Menú de actividad física
    print("\nNivel de actividad física diaria:")
    print("1. Sedentario (Poco o ningún ejercicio)")
    print("2. Ligero (Ejercicio ligero 1-3 días/semana)")
    print("3. Moderado (Ejercicio moderado 3-5 días/semana)")
    print("4. Fuerte (Entrenamiento intenso 6-7 días/semana)")
    print("5. Muy fuerte (Atletas o trabajo físico extremo)")

    actividades = {
        "1": NivelActividad.SEDENTARIO,
        "2": NivelActividad.LIGERO,
        "3": NivelActividad.MODERADO,
        "4": NivelActividad.FUERTE,
        "5": NivelActividad.MUY_FUERTE,
    }

    opcion_act = ""
    while opcion_act not in actividades:
        opcion_act = input("Selecciona tu nivel (1-5): ").strip()

    nivel_actividad = actividades[opcion_act]

    # Objetivo calórico
    print("\nObjetivo corporal y nutricional:")
    print("1. Mantenimiento (Conservar peso actual)")
    print("2. Déficit moderado (Pérdida de grasa sostenible -15%)")
    print("3. Déficit agresivo (Pérdida de peso más rápida -25%)")
    print("4. Superávit limpio (Ganancia muscular magra +10%)")
    print("5. Superávit volumen (Hipertrofia intensiva +15%)")

    objetivos = {
        "1": ObjetivoCalorico.MANTENIMIENTO,
        "2": ObjetivoCalorico.DEFICIT_MODERADO,
        "3": ObjetivoCalorico.DEFICIT_AGRESIVO,
        "4": ObjetivoCalorico.SUPERAVIT_LIGERO,
        "5": ObjetivoCalorico.SUPERAVIT_VOLUMEN,
    }

    opcion_obj = ""
    while opcion_obj not in objetivos:
        opcion_obj = input("Selecciona tu objetivo (1-5): ").strip()

    objetivo = objetivos[opcion_obj]

    # Creación del perfil y cálculo
    perfil = PerfilUsuarioInput(
        edad=edad,
        peso_kg=peso,
        estatura_m=estatura,
        sexo=sexo,
        nivel_actividad=nivel_actividad,
        objetivo=objetivo,
        cintura_cm=cintura,
        porcentaje_grasa=grasa,
    )

    reporte = generar_reporte_completo(perfil)

    # Impresión del reporte
    print("\n" + "=" * 60)
    print("                      REPORTE FINAL                           ")
    print("=" * 60)
    print(f"-> IMC Estándar (Quetelet) : {reporte.imc.imc_estandar} ({reporte.imc.clasificacion_oms})")
    print(f"-> Nuevo IMC (Trefethen)   : {reporte.imc.nuevo_imc_trefethen}")
    print(f"-> Rango saludable teórico : {reporte.imc.peso_minimo_saludable_kg} kg - {reporte.imc.peso_maximo_saludable_kg} kg")

    if reporte.imc.rfm_grasa_estimada:
        print(f"-> Masa Grasa Relativa RFM : {reporte.imc.rfm_grasa_estimada}%")
    if reporte.imc.whtr_cintura_estatura:
        print(f"-> Índice Cintura/Estatura : {reporte.imc.whtr_cintura_estatura} ({reporte.imc.riesgo_cardiometabolico})")

    print("-" * 60)
    print(f"-> Tasa Metabólica Basal   : {reporte.tmb.tmb_kcal:.2f} kcal/día")
    print(f"   (Método: {reporte.tmb.nombre_metodo})")
    if reporte.tmb.masa_magra_kg:
        print(f"   (Masa magra estimada    : {reporte.tmb.masa_magra_kg} kg)")

    print("-" * 60)
    print(f"-> Gasto Diario Mantenimiento (GET) : {reporte.get.get_mantenimiento_kcal:.2f} kcal/día")
    print(f"-> Meta Calórica para el Objetivo   : {reporte.get.calorias_objetivo_kcal:.2f} kcal/día ({reporte.get.diferencia_calorica_kcal:+.0f} kcal)")
    print(f"   - Termogénesis Alimentos (TEF)   : ~{reporte.get.tef_estimado_kcal:.2f} kcal/día")
    print(f"   - Gasto por Actividad (EAT+NEAT) : ~{reporte.get.gasto_actividad_kcal:.2f} kcal/día")

    print("-" * 60)
    print("-> Distribución Sugerida de Macronutrientes:")
    macros = reporte.get.macronutrientes
    print(f"   • Proteínas     : {macros.proteinas_g:.1f} g ({macros.proteinas_kcal:.0f} kcal)")
    print(f"   • Grasas        : {macros.grasas_g:.1f} g ({macros.grasas_kcal:.0f} kcal)")
    print(f"   • Carbohidratos : {macros.carbohidratos_g:.1f} g ({macros.carbohidratos_kcal:.0f} kcal)")
    print("=" * 60)


if __name__ == "__main__":
    analizador()
