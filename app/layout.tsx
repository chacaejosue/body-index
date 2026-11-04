import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site";
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

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "BodyIndex | Calculadora Metabólica, IMC y Gasto Energético (TDEE)",
    template: "%s | BodyIndex",
  },
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
  creator: "BodyIndex Team",
  publisher: "BodyIndex",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "BodyIndex | Calculadora Metabólica, IMC y Gasto Energético (TDEE)",
    description:
      "Calcula tu IMC, metabolismo basal, gasto calórico diario y macronutrientes con base en consensos OMS, Oxford e ISSN. Sin anuncios ni registros.",
    url: baseUrl,
    siteName: "BodyIndex",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BodyIndex - Calculadora Metabólica y Antropométrica de Precisión",
      },
    ],
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BodyIndex | Calculadora Metabólica Científica",
    description:
      "Calcula tu IMC, TMB, GET y macronutrientes con los consensos científicos más recientes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "googleb5b7ccc5531c4c29",
  },
  category: "health",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "BodyIndex",
      url: baseUrl,
      image: `${baseUrl}/og-image.png`,
      description:
        "Plataforma científica para estimaciones de IMC, TMB, GET y distribución de macronutrientes sin publicidad ni barreras de registro.",
      applicationCategory: "HealthApplication",
      operatingSystem: "All",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      creator: {
        "@type": "Organization",
        name: "BodyIndex",
        logo: `${baseUrl}/icon-512.png`,
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
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="antialiased selection:bg-amber-500/20 selection:text-amber-500">
        {children}
      </body>
    </html>
  );
}
