import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BodyIndex - Calculadora Metabólica y Antropométrica",
    short_name: "BodyIndex",
    description:
      "Calculadora científica de IMC, TMB, GET y macronutrientes basada en consensos OMS e ISSN.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon-48x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
