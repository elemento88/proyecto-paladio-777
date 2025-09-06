# Configuración API-Football - Paladio77

## Problema Actual

La aplicación está configurada para usar API-Football de RapidAPI, pero la clave API actual no está suscrita al servicio.

**Error actual**: `"You are not subscribed to this API."`

## Solución Temporal

✅ **Implementado**: La aplicación ahora muestra datos mock realistas que incluyen:
- Partidos de hoy con equipos reales (Man City vs Arsenal, Real Madrid vs Barcelona, etc.)
- Partidos en vivo simulados con marcadores
- Diferentes ligas: Premier League, La Liga, Serie A, Bundesliga, Champions League

## Para Obtener Datos Reales

### Paso 1: Suscribirse a API-Football
1. Ve a [RapidAPI - API-Football](https://rapidapi.com/api-sports/api/api-football)
2. Haz clic en "Subscribe" 
3. Elige un plan:
   - **Free**: 100 requests/día (gratis)
   - **Basic**: 1,000 requests/día ($10/mes)
   - **Pro**: 3,000 requests/día ($25/mes)

### Paso 2: Verificar la Suscripción
1. Una vez suscrito, puedes probar la API:
```bash
curl -X GET "https://api-football-v1.p.rapidapi.com/v3/fixtures?date=2025-01-06" \
  -H "X-RapidAPI-Key: TU_API_KEY" \
  -H "X-RapidAPI-Host: api-football-v1.p.rapidapi.com"
```

2. Deberías recibir datos JSON reales en lugar del error de suscripción.

### Paso 3: Configuración Actual
La aplicación ya está configurada con:
- ✅ Variables de entorno en `.env.local`
- ✅ API key: `75738481367b0be7972ef057f08766f8`
- ✅ Sistema de fallback a datos mock si falla la API
- ✅ Rate limiting implementado
- ✅ Manejo de errores

## Características Implementadas

### Datos Disponibles
- **Partidos de Hoy**: Fixtures programados para el día actual
- **En Vivo**: Partidos que se están jugando ahora
- **Rate Limiting**: Control de límites de API calls
- **Auto-refresh**: Actualización automática cada 30 segundos

### Ligas Soportadas
- Premier League (Inglaterra)
- La Liga (España) 
- Serie A (Italia)
- Bundesliga (Alemania)
- Champions League
- Europa League

### Interfaz
- Pestañas "Hoy" y "En Vivo"
- Indicadores de estado (Not Started, Live, Finished)
- Marcadores en tiempo real
- Información de liga y equipos

## Una Vez Suscrito

Cuando tengas una suscripción activa:
1. La aplicación automáticamente detectará los datos reales
2. Los datos mock serán reemplazados por información en vivo
3. El aviso amarillo de "Datos de demostración" desaparecerá
4. Verás partidos reales en curso y programados

## Logs y Debug

Para verificar el estado de la API, revisa la consola del navegador:
- ✅ `"No real API data available, using mock fixtures for today"`
- ❌ `"API call error"` o `"You are not subscribed"`

## Soporte

La implementación actual es robusta y funcionará tanto con datos reales como mock, proporcionando una experiencia completa independientemente del estado de suscripción de la API.