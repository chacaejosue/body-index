<p align="center">
  <img src="./assets/portada-body-index.png" alt="BodyIndex - Analizador de métricas corporales en Python" width="100%">
</p>

<p align="center">
  Aplicación de consola desarrollada en Python para calcular y presentar estimaciones de <strong>IMC, TMB y gasto energético diario</strong> a partir de datos ingresados por el usuario.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/Interfaz-CLI-4B5563?style=for-the-badge" alt="CLI">
  <img src="https://img.shields.io/badge/Licencia-MIT-F5B942?style=for-the-badge" alt="MIT License">
  <img src="https://img.shields.io/badge/Estado-En%20desarrollo-8B5CF6?style=for-the-badge" alt="Estado">
</p>

---

## Sobre BodyIndex

**BodyIndex** es un proyecto educativo desarrollado en Python para practicar la implementación de cálculos, validación de datos, organización modular y manejo de errores mediante una aplicación de línea de comandos.

A partir de datos como edad, peso, estatura, sexo y nivel de actividad física, el programa calcula diferentes indicadores y estimaciones relacionadas con el cuerpo y el gasto energético.

Actualmente incluye:

- **Índice de Masa Corporal (IMC)**
- **Tasa Metabólica Basal (TMB)**
- **Gasto Energético Total estimado (GET)**
- Clasificación del IMC
- Validación de datos de entrada
- Generación de un reporte final en consola

> [!IMPORTANT]
> BodyIndex es un proyecto educativo. Sus resultados son estimaciones generales y no sustituyen una valoración médica, nutricional o clínica.

---

## Inicio rápido

### Requisitos

- Python **3.10 o superior**
- Git, únicamente si deseas clonar el repositorio

### Clonar el proyecto

```bash
git clone https://github.com/chacaejosue/body-index.git
cd body-index
```

### Ejecutar

```bash
python src/analizador.py
```

En algunos sistemas Unix/Linux:

```bash
python3 src/analizador.py
```

---

## Funcionalidades

### Índice de Masa Corporal

El programa calcula el **IMC** utilizando el peso y la estatura proporcionados por el usuario.

```text
IMC = peso / estatura²
```

El resultado se acompaña de una clasificación basada en los rangos implementados por la aplicación.

### Tasa Metabólica Basal

BodyIndex estima la **Tasa Metabólica Basal (TMB)** mediante la ecuación de **Mifflin-St Jeor**, utilizando datos como:

- peso
- estatura
- edad
- sexo

La TMB representa una estimación de la energía que el organismo utiliza en reposo.

### Gasto Energético Total

A partir de la TMB y del nivel de actividad seleccionado, el programa estima el **Gasto Energético Total (GET)**.

Esto permite obtener una aproximación del consumo energético diario asociado al nivel de actividad indicado por el usuario.

### Validación de entradas

Las entradas son verificadas antes de realizar los cálculos para reducir datos inválidos y errores durante la ejecución.

El programa controla:

- tipos de datos incorrectos
- valores fuera de los rangos definidos
- opciones no reconocidas
- excepciones como `ValueError`

---

## Ejemplo de ejecución

Al finalizar los cálculos, BodyIndex genera un reporte directamente en la terminal:

```text
==================================================
                 REPORTE FINAL
==================================================
-> IMC Calculado           : 27.76
-> Clasificación           : Sobrepeso
-> Metabolismo Basal (TMB) : 1828.75 kcal
-> Gasto Diario Total (GET): 2834.56 kcal
==================================================
```

Esto permite consultar los resultados de forma rápida sin depender de una interfaz gráfica o servicios externos.

---

## Datos de entrada

Actualmente la aplicación utiliza los siguientes parámetros:

| Dato | Valores admitidos |
|---|---|
| Sexo | `M` o `F` |
| Edad | `1` a `120` años |
| Peso | `2` a `500` kg |
| Estatura | `0.50` a `2.50` m |
| Actividad física | Nivel `1` a `5` |

La entrada correspondiente al sexo se procesa sin distinguir entre mayúsculas y minúsculas.

---

## Estructura del proyecto

```text
body-index/
├── assets/
│   └── portada.png
│
├── src/
│   └── analizador.py
│
├── .gitignore
├── LICENSE
└── README.md
```

### `src/`

Contiene la implementación principal de la aplicación.

### `assets/`

Almacena los recursos visuales utilizados en la documentación del proyecto.

---

## Enfoque del proyecto

BodyIndex fue desarrollado principalmente como ejercicio de programación para aplicar conceptos como:

```text
entrada de datos
      ↓
validación
      ↓
procesamiento
      ↓
cálculos
      ↓
formateo de resultados
      ↓
reporte en consola
```

El proyecto prioriza una implementación sencilla y comprensible antes que una arquitectura innecesariamente compleja.

---

## Consideraciones

Los resultados generados dependen completamente de los datos proporcionados por el usuario y de las fórmulas implementadas.

Indicadores como el IMC tienen limitaciones y no describen por sí solos aspectos como:

- porcentaje de grasa corporal
- masa muscular
- distribución de grasa
- estado nutricional completo
- condiciones médicas individuales

De la misma forma, la TMB y el GET son **estimaciones**, no mediciones directas del metabolismo o del gasto energético real.

> [!WARNING]
> No utilices los resultados de BodyIndex para diagnóstico, tratamiento, prescripción dietética o decisiones médicas.

---

## Roadmap

Algunas mejoras previstas para futuras versiones:

- [ ] Separar la lógica de cálculo de la interacción por consola.
- [ ] Añadir pruebas automatizadas.
- [ ] Ampliar las validaciones de entrada.
- [ ] Mejorar la experiencia de usuario de la CLI.
- [ ] Generar un reporte exportable con los resultados.
- [ ] Crear una interfaz gráfica para visualizar las métricas.
- [ ] Añadir gráficas y visualizaciones de los resultados.

---

## Aprendizajes

El desarrollo de BodyIndex permite practicar conceptos como:

- funciones en Python
- anotaciones de tipos
- validación de entradas
- manejo de excepciones
- estructuras condicionales
- cálculos y fórmulas
- separación de responsabilidades
- diseño de interfaces de consola
- documentación técnica con Markdown
- organización de un proyecto en GitHub

---

## Autor

Desarrollado por **Josué Chacae**.

<p>
  <a href="https://github.com/chacaejosue">
    <img src="https://img.shields.io/badge/GitHub-chacaejosue-181717?style=for-the-badge&logo=github" alt="GitHub">
  </a>
</p>

---

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](./LICENSE).

Puedes utilizarlo, modificarlo y adaptarlo respetando los términos establecidos en la licencia.