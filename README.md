# TRACKON — Dashboard de Operaciones Logísticas

Dashboard fullstack interactivo para una empresa ficticia de carga y logística. Proyecto de portafolio construido con React, TypeScript, Node.js y PostgreSQL.

## Demo

🔗 [trackon-dashboard.vercel.app](https://trackon-dashboard.vercel.app)

**Credenciales demo**
- Email: demo@trackon.com
- Password: demo1234

![Dashboard Preview](./preview.png)

## Características

- **Autenticación completa** con JWT — login, sesión persistente y logout
- **5 vistas navegables** — Resumen, Flota, Envíos, Rutas y Alertas
- **Datos reales** desde una API REST propia con PostgreSQL
- **Gráficas interactivas** con Chart.js (barras y doughnut)
- **Asistente IA** integrado con la API de Claude
- **Filtros dinámicos** en la vista de envíos
- **Badges dinámicos** en el sidebar con conteos reales desde la DB

## Stack

**Frontend**
- React 19 + TypeScript
- Tailwind CSS v4
- Chart.js + react-chartjs-2
- Vite
- Deploy: Vercel

**Backend**
- Node.js + Express.js + TypeScript
- PostgreSQL (Neon) + Prisma ORM
- JWT + bcrypt
- Helmet + express-rate-limit + express-validator
- Deploy: Railway

## Correr en local

### Backend

1. Clona el repositorio del backend
```bash
git clone https://github.com/aldayr935-ux/trackon-api.git
cd trackon-api
```

2. Instala dependencias
```bash
npm install
```

3. Crea un archivo `.env` en la raíz
```bash
PORT=3000
DATABASE_URL=postgresql://usuario:password@...neon.tech/neondb?sslmode=require
JWT_SECRET=tu_secret_aqui
JWT_EXPIRES_IN=7d
```

4. Corre las migraciones y el seed
```bash
npx prisma migrate deploy
npm run seed
```

5. Inicia el servidor
```bash
npm run dev
```

### Frontend

1. Clona el repositorio del frontend
```bash
git clone https://github.com/aldayr935-ux/trackon-dashboard.git
cd trackon-dashboard
```

2. Instala dependencias
```bash
npm install
```

3. Crea un archivo `.env` en la raíz
```bash
VITE_API_URL=http://localhost:3000/api
VITE_ANTHROPIC_API_KEY=sk-ant-tu-api-key-aqui
```

4. Inicia el proyecto
```bash
npm run dev
```

5. Abre [http://localhost:5173](http://localhost:5173)

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
├── context/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── api.ts
├── types/
│   └── index.ts
└── App.tsx

## Autor

Aldayr — [ALDACODE](https://aldacode.com)