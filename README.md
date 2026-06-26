# Analizador BodyIndex

![Python Version](https://img.shields.io/badge/python-3.10%2B-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

Analizador BodyIndex es una aplicación de consola escrita en Python diseñada para calcular métricas de composición corporal y gasto energético basadas en estándares internacionales reconocidos.

El proyecto está estructurado de manera modular, implementando validación estricta de tipos y rangos para garantizar la consistencia de los datos de entrada.

## Características principales

- **Índice de Masa Corporal (IMC):** Cálculo automatizado y clasificación jerárquica según los rangos oficiales de la Organización Mundial de la Salud (OMS).
- **Tasa Metabólica Basal (TMB):** Implementación exacta de la ecuación de Mifflin-St Jeor (1990), adaptada por sexo biológico.
- **Gasto Energético Total (GET):** Estimación del consumo calórico diario de mantenimiento mediante la aplicación de coeficientes de actividad física.
- **Validación robusta:** Control de excepciones (`ValueError`) y límites lógicos para variables de peso, estatura, edad y sexo (`M/F`) para evitar errores de entrada.

## Estructura del reporte

Cuando se ejecuta, el programa genera una salida formateada limpia directamente en la interfaz de línea de comandos:

```text
==================================================
                 REPORTE FINAL
==================================================
-> IMC Calculado           : 27.76
-> Clasificación OMS       : Sobrepeso
-> Metabolismo Basal (TMB) : 1828.75 kcal
-> Gasto Diario Total (GET): 2834.56 kcal (Para mantener peso)
==================================================
```

## Requisitos de entorno

- Python **3.10** o superior (debido al uso de operadores de unión de tipos `|` en anotaciones de tipado).

## Instalación y ejecución

Clona este repositorio o descarga el archivo principal:

```bash
git clone https://github.com/chacaejosue/body-index.git
cd body-index
```

Ejecuta el script desde tu terminal:

```bash
python src/analizador.py
```

> En sistemas Unix/Linux, puede ser necesario usar:
>
> ```bash
> python3 src/analizador.py
> ```

## Variables de entrada validadas

El sistema restringe las entradas del usuario bajo los siguientes parámetros de control:

- **Género:** `M` (Masculino) o `F` (Femenino).  
  La entrada se procesa de forma insensible a mayúsculas/minúsculas.
- **Edad:** rango entero permitido entre `1` y `120` años.
- **Peso:** rango flotante permitido entre `2` kg y `500` kg.
- **Estatura:** rango flotante permitido en metros entre `0.50` y `2.50`.
- **Factor de actividad:** selección numérica del `1` al `5` asociada a multiplicadores metabólicos (`1.2` a `1.9`).

## Roadmap / Próximas mejoras

- [ ] Generar un reporte en PDF al finalizar la ejecución (resumen de métricas, interpretación, consejos personalizados y exportación).
- [ ] Versión visual (GUI de escritorio usando librerías Python — p. ej. `tkinter`, `PySimpleGUI`, `PyQt` o `Kivy`) con gráficas interactivas y formulario de entrada.

## Descargo de responsabilidad

Este software está diseñado para proporcionar estimaciones aproximadas con fines informativos y educativos. Los resultados ofrecidos son aproximaciones y no deben utilizarse como diagnóstico, prescripción o sustituto de la valoración por un profesional de la salud. Se recomienda consultar con un profesional (médico, nutricionista u otro especialista) para interpretación clínica, diagnóstico o tratamiento. Utiliza este proyecto únicamente como referencia y orientación inicial.

## Licencia

Este proyecto está bajo la [Licencia MIT](./LICENSE).

Eres libre de adaptarlo y usarlo en tus proyectos, siempre que respetes la nota de licencia original. Fue un gran ejercicio de práctica para mí, y espero que te sea igual de útil para aprender.