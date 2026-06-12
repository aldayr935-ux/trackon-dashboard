# TRACKON — Dashboard de Operaciones Logísticas

Dashboard interactivo para una empresa ficticia de carga y logística. Proyecto de portafolio construido con React, TypeScript y Tailwind CSS.

![Dashboard Preview](./preview.png)

## Características

- **5 vistas navegables** — Resumen, Flota, Envíos, Rutas y Alertas
- **Gráficas interactivas** con Chart.js (barras, línea y doughnut)
- **Asistente IA** integrado con la API de Claude que responde preguntas sobre la operación en tiempo real
- **Filtros dinámicos** en la vista de envíos
- Datos simulados realistas de una flota de 45 vehículos

## Stack

- React 19 + TypeScript
- Tailwind CSS v4
- Chart.js + react-chartjs-2
- Vite
- API de Anthropic (Claude Sonnet)

## Correr en local

1. Clona el repositorio
```bash
   
   cd trackon-dashboard
```

2. Instala dependencias
```bash
   npm install
```

3. Crea un archivo `.env` en la raíz con tu API key de Anthropic
```bash
   VITE_ANTHROPIC_API_KEY=sk-ant-tu-api-key-aqui
```
Puedes obtener una en [console.anthropic.com](https://console.anthropic.com)

4. Inicia el proxy CORS en una terminal
```bash
   npx local-cors-proxy --proxyUrl https://api.anthropic.com --port 8010
```

5. En otra terminal, inicia el proyecto
```bash
   npm run dev
```

6. Abre [http://localhost:5173](http://localhost:5173)

> El proxy es necesario solo en desarrollo. En producción se requiere un backend propio para las llamadas a la API.

## Estructura del proyecto

Puedes obtener una en [console.anthropic.com](https://console.anthropic.com)

4. Inicia el proxy CORS en una terminal
```bash
   npx local-cors-proxy --proxyUrl https://api.anthropic.com --port 8010
```

5. En otra terminal, inicia el proyecto
```bash
   npm run dev
```

6. Abre [http://localhost:5173](http://localhost:5173)

> El proxy es necesario solo en desarrollo. En producción se requiere un backend propio para las llamadas a la API.

## Estructura del proyecto
src/
├── components/
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── AssistantPanel.tsx
│   └── views/
│       ├── ResumenView.tsx
│       ├── FlotaView.tsx
│       ├── EnviosView.tsx
│       ├── RutasView.tsx
│       └── AlertasView.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
└── App.tsx

## Autor

Aldayr — [NETIKA]