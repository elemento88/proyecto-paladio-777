# Proyecto Paladio77 🏆

Una plataforma moderna de apuestas deportivas y desafíos construida con Next.js 15, React 18 y Supabase.

## 🚀 Tecnologías Principales

- **Framework**: Next.js 15.5.1 con App Router
- **Frontend**: React 18.3 con TypeScript
- **Estilos**: Tailwind CSS 4.0
- **Base de Datos**: Supabase (PostgreSQL)
- **Estado**: TanStack React Query
- **Blockchain**: Web3Modal + Ethers.js v5
- **Lint**: ESLint 9

## 📁 Estructura del Proyecto

```
proyecto-paladio77/
├── 📁 src/
│   ├── 📁 app/                    # App Router de Next.js 15
│   │   ├── 📁 admin/             # Panel de administración
│   │   ├── 📁 api/               # API Routes
│   │   ├── 📁 auth/              # Autenticación
│   │   │   └── 📁 callback/      # Callback de OAuth
│   │   ├── 📁 challenge/         # Sistema de desafíos
│   │   │   └── 📁 join/          # Unirse a desafíos
│   │   ├── 📁 config/            # Configuración
│   │   ├── 📁 create/            # Crear desafíos/eventos
│   │   ├── 📁 markets/           # Mercados de apuestas
│   │   ├── 📁 matches/           # Partidos/eventos
│   │   └── 📁 sports/            # Deportes y juegos
│   │       ├── 📁 challenges/    # Desafíos deportivos específicos
│   │       │   └── 📁 [gameId]/  # Desafío por ID
│   │       ├── 📁 create/        # Crear eventos deportivos
│   │       └── 📁 [sport]/       # Deporte específico
│   │           └── 📁 games/     # Juegos del deporte
│   │
│   ├── 📁 components/            # Componentes React reutilizables
│   │   ├── ApiStatusIndicator.tsx     # Indicador estado API
│   │   ├── CacheDebugger.tsx          # Debug de caché
│   │   ├── CacheStatus.tsx            # Estado del caché
│   │   ├── EventsForcer.tsx           # Forzar eventos
│   │   ├── ForceDataRefresh.tsx       # Refrescar datos
│   │   ├── InfiniteScrollLoader.tsx   # Scroll infinito
│   │   ├── LiveScores.tsx             # Marcadores en vivo
│   │   └── TopHeader.tsx              # Header principal
│   │
│   ├── 📁 contexts/              # Contextos de React
│   │
│   ├── 📁 hooks/                 # Hooks personalizados
│   │   ├── useEventsLoader.ts    # Cargar eventos
│   │   └── useSports.ts          # Datos deportivos
│   │
│   ├── 📁 lib/                   # Librerías y utilidades
│   │   ├── eventsCache.ts        # Sistema de caché
│   │   ├── mockSportsApi.ts      # API mock deportiva
│   │   └── unifiedSportsApi.ts   # API unificada deportes
│   │
│   ├── 📁 types/                 # Definiciones TypeScript
│   │   └── sports.ts             # Tipos deportivos
│   │
│   └── 📁 utils/                 # Funciones utilitarias
│
├── 📁 public/                    # Archivos estáticos
├── 📁 .claude/                   # Configuración Claude Code
├── 📄 .env.local                 # Variables de entorno locales
├── 📄 .env.example              # Ejemplo variables entorno
├── 📄 supabase-*.sql            # Esquemas base de datos
├── 📄 create-tables*.sql        # Scripts creación tablas
├── 📄 package.json              # Dependencias npm
└── 📄 next.config.js            # Configuración Next.js
```

## 🔧 Funcionalidades Principales

### 🏈 Sistema Deportivo
- **Deportes Múltiples**: Soporte para diferentes deportes
- **Marcadores en Vivo**: Actualizaciones en tiempo real
- **Cache Inteligente**: Sistema de caché optimizado
- **API Unificada**: Integración con múltiples fuentes

### 🎮 Sistema de Desafíos
- **Creación de Desafíos**: Los usuarios pueden crear desafíos personalizados
- **Unirse a Desafíos**: Sistema para participar en desafíos existentes
- **Gestión por Juego**: Organización por ID de juego específico

### 🔐 Autenticación
- **Supabase Auth**: Sistema completo de autenticación
- **OAuth Callbacks**: Soporte para proveedores externos
- **Sesiones Seguras**: Manejo seguro de sesiones

### 💰 Integración Blockchain
- **Web3Modal**: Conexión a wallets
- **Ethers.js**: Interacción con contratos inteligentes
- **Transacciones**: Manejo de apuestas y pagos

### 📊 Sistema de Cache
- **Cache Debugger**: Herramientas de debugging
- **Force Refresh**: Refrescar datos manualmente
- **Estado Visible**: Indicadores de estado del caché

## 🛠️ Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build

# Producción
npm start

# Linting
npm run lint
```

## 🚀 Inicio Rápido

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/elemento88/proyecto-paladio-777.git
   cd proyecto-paladio-777
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env.local
   # Editar .env.local con tus credenciales
   ```

4. **Configurar base de datos**
   ```bash
   # Ejecutar scripts SQL en Supabase
   node setup-database.js
   ```

5. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

## 📱 Características Técnicas

- ✅ **Next.js 15** con App Router
- ✅ **TypeScript** para type safety
- ✅ **Tailwind CSS 4** para estilos
- ✅ **React Query** para estado del servidor
- ✅ **Infinite Scroll** para listas grandes
- ✅ **Real-time Updates** con Supabase
- ✅ **Web3 Integration** para blockchain
- ✅ **Cache Management** optimizado
- ✅ **Responsive Design** mobile-first

## 🔄 APIs y Datos

- **Sports API**: Sistema unificado para datos deportivos
- **Mock API**: API de prueba para desarrollo
- **Cache System**: Sistema de caché inteligente con TTL
- **Real-time**: Actualizaciones en tiempo real

## 🏗️ Arquitectura

La aplicación sigue el patrón de **App Router** de Next.js 15 con:
- **Server Components** por defecto
- **Client Components** cuando necesario
- **API Routes** para backend
- **Middleware** para autenticación
- **Database Functions** en Supabase

---

**Desarrollado con ❤️ usando Next.js 15 y las mejores prácticas modernas**
