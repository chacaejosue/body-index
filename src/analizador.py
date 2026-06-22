def calcular_imc(peso: float, estatura: float) -> float:
    """Calcula el Índice de Masa Corporal (IMC)."""
    return peso / (estatura ** 2)


def obtener_rango_imc(imc: float) -> str:
    """Devuelve la clasificación de la OMS según el IMC."""
    if imc < 18.5:
        return "Bajo peso"
    elif imc < 25.0:
        return "Peso normal (Saludable)"
    elif imc < 30.0:
        return "Sobrepeso"
    elif imc < 35.0:
        return "Obesidad Grado 1 (Moderada)"
    elif imc < 40.0:
        return "Obesidad Grado 2 (Severa)"
    else:
        return "Obesidad Grado 3 (Mórbida)"


def calcular_tmb(peso: float, estatura: float, edad: int, sexo: str) -> float:
    """Calcula la Tasa Metabólica Basal usando Mifflin-St Jeor (Estatura en metros)."""
    sexo = sexo.strip().lower()
    if sexo not in ("m", "f"):
        raise ValueError("Sexo inválido. Usa 'm' para masculino o 'f' para femenino.")

    estatura_cm = estatura * 100

    if sexo == "m":
        return (10 * peso) + (6.25 * estatura_cm) - (5 * edad) + 5
    else:  # sexo == "f"
        return (10 * peso) + (6.25 * estatura_cm) - (5 * edad) - 161


def pedir_float(
    mensaje: str,
    minimo: float | None = None,
    maximo: float | None = None
) -> float:
    """Pide un número decimal y valida rango."""
    while True:
        try:
            valor = float(input(mensaje))
            if minimo is not None and valor < minimo:
                print(f"Error: El valor debe ser >= {minimo}. Intenta de nuevo.")
                continue
            if maximo is not None and valor > maximo:
                print(f"Error: El valor debe ser <= {maximo}. Intenta de nuevo.")
                continue
            return valor
        except ValueError:
            print("Error: Entrada inválida. Por favor, introduce un número.")


def pedir_int(
    mensaje: str,
    minimo: int | None = None,
    maximo: int | None = None
) -> int:
    """Pide un número entero y valida rango."""
    while True:
        try:
            valor = int(input(mensaje))
            if minimo is not None and valor < minimo:
                print(f"Error: El valor debe ser >= {minimo}. Intenta de nuevo.")
                continue
            if maximo is not None and valor > maximo:
                print(f"Error: El valor debe ser <= {maximo}. Intenta de nuevo.")
                continue
            return valor
        except ValueError:
            print("Error: Entrada inválida. Introduce un número entero.")


def pedir_sexo() -> str:
    """Pide y valida el sexo biológico para la fórmula de TMB."""
    while True:
        sexo = input("Introduce tu género (M para Masculino / F para Femenino): ").strip().lower()
        if sexo in ("m", "f"):
            return sexo
        print("Error: Opción inválida. Usa solo 'M' o 'F'.")


def analizador():
    print("=" * 50)
    print("       BIENVENIDO AL ANALIZADOR BODYINDEX       ")
    print("=" * 50)

    # Captura de datos validados
    sexo = pedir_sexo()
    edad = pedir_int("Introduce tu edad (años): ", minimo=1, maximo=120)
    peso = pedir_float("Introduce tu peso (kg): ", minimo=2, maximo=500)
    estatura = pedir_float("Introduce tu estatura (metros, ej: 1.75): ", minimo=0.5, maximo=2.5)

    # Procesamiento de datos
    imc = calcular_imc(peso, estatura)
    rango_imc = obtener_rango_imc(imc)
    tmb = calcular_tmb(peso, estatura, edad, sexo)

    # Menú de actividad física
    print("\nNivel de actividad física:")
    print("1. Sedentario (Poco o nada de ejercicio)")
    print("2. Ligero (Ejercicio suave 1-3 días/semana)")
    print("3. Moderado (Ejercicio moderado 3-5 días/semana)")
    print("4. Fuerte (Deporte intenso 6-7 días/semana)")
    print("5. Muy fuerte (Atletas o trabajo físico pesado)")

    factores = {"1": 1.2, "2": 1.375, "3": 1.55, "4": 1.725, "5": 1.9}
    opcion = ""
    while opcion not in factores:
        opcion = input("Selecciona tu nivel (1-5): ").strip()
        if opcion not in factores:
            print("Error: Opción no válida.")

    factor = factores[opcion]
    gasto_total = tmb * factor

    # Reporte final
    print("\n" + "=" * 50)
    print("                 REPORTE FINAL                 ")
    print("=" * 50)
    print(f"-> IMC Calculado           : {imc:.2f}")
    print(f"-> Classification OMS       : {rango_imc}")
    print(f"-> Metabolismo Basal (TMB) : {tmb:.2f} kcal")
    print(f"-> Gasto Diario Total (GET): {gasto_total:.2f} kcal (Para mantener peso)")
    print("=" * 50)


if __name__ == "__main__":
    analizador()