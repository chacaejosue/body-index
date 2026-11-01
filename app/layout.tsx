import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "BodyIndex | Calculadora Metabólica, IMC y Gasto Energético Científico",
  description:
    "Calculadora metabólica y antropométrica de alta precisión en Python y Next.js. Estima IMC, TMB (Mifflin, Katch-McArdle, Oxford), GET/TDEE y macronutrientes (ISSN) sin publicidad y con ficha descargable.",
  keywords: [
    "calculadora imc",
    "calculadora tmb",
    "calculadora tdee",
    "gasto energetico total",
    "deficit calorico",
    "katch mcardle",
    "mifflin st jeor",
    "nuevo imc oxford",
    "macronutrientes issn",
    "porcentaje grasa rfm",
  ],
  authors: [{ name: "BodyIndex Team" }],
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "BodyIndex | Calculadora Metabólica Científica",
    description:
      "Calcula tu IMC, metabolismo basal, gasto calórico diario y macronutrientes con base en consensos OMS, Oxford e ISSN. Sin anuncios ni registros.",
    type: "website",
    locale: "es_ES",
    siteName: "BodyIndex",
  },
  twitter: {
    card: "summary_large_image",
    title: "BodyIndex | Calculadora Metabólica Científica",
    description:
      "Calcula tu IMC, TMB, GET y macronutrientes con los consensos científicos más recientes.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BodyIndex",
      url: "https://bodyindex.app",
      description:
        "Plataforma científica para estimaciones de IMC, TMB, GET y distribución de macronutrientes sin publicidad ni barreras de registro.",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿Por qué el IMC tradicional falla en personas deportistas?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "El IMC estándar (Quetelet) no diferencia entre masa muscular y tejido adiposo. BodyIndex ofrece el Nuevo IMC de Oxford (Trefethen), la Masa Grasa Relativa (RFM) y el Índice Cintura-Estatura (WHtR) para evaluar la composición real.",
          },
        },
        {
          "@type": "Question",
          name: "¿Qué fórmula de metabolismo basal (TMB) es más confiable?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mifflin-St Jeor (1990) es la fórmula de referencia más precisa para la población general. Si se conoce la masa libre de grasa, Katch-McArdle calcula el consumo calórico basal exacto sobre el tejido biológicamente activo.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo se calcula la meta calórica para perder grasa o ganar músculo?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A partir del Gasto Energético Total (GET / TDEE), se aplica un déficit calórico del 15% al 25% para pérdida de grasa preservando músculo, o un superávit del 10% al 15% para hipertrofia limpia según la Sociedad Internacional de Nutrición Deportiva (ISSN).",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-amber-500/20 selection:text-amber-500">
        {children}
      </body>
    </html>
  );
}
