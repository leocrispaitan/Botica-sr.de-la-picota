# Dompet Dashboard frontend

Réplica en código (React + TypeScript + Vite + Tailwind CSS v4) del diseño de Figma:
"Codia AI Web2Figma: Import Web to Editable Figma (Comunidad)".

## Instalación

```bash
npm install
npm run dev
```

## Notas importantes

- Las imágenes (avatares, iconos, gráficos SVG rasterizados) se están cargando
  directamente desde las URLs temporales de exportación de Figma
  (`https://www.figma.com/api/mcp/asset/...`). Esas URLs **expiran en ~7 días**.
  Para producción, descarga esos assets desde Figma (botón "Export") y
  reemplázalos en `src/components/assets.ts` por rutas locales en `/src/assets`.
- Fuente: Cairo (cargada desde Google Fonts en `src/index.css`).
- Los gráficos de líneas ("Activity" y "Transaction Overview") se reprodujeron
  usando las imágenes SVG exportadas tal cual desde Figma. Si más adelante
  quieres que sean gráficos dinámicos/reales (con datos), lo ideal es
  reconstruirlos con una librería como `recharts` o `chart.js`.
- El layout usa posicionamiento absoluto (igual que el export de Figma) dentro
  de un contenedor de 934px de ancho, para mantener el diseño pixel-perfect.
  Si luego quieres que sea responsive, avísame y lo adapto a un grid fluido.
