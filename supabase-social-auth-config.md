# Configuración de Autenticación Social en Supabase

## Configurar Proveedores Sociales

### 1. En tu Dashboard de Supabase:
1. Ve a **Authentication > Providers**
2. Configura los siguientes proveedores:

### 2. Google (Gmail) OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la **Google+ API**
4. Ve a **Credenciales > Crear credenciales > ID de cliente OAuth 2.0**
5. Configura:
   - **Tipo de aplicación**: Aplicación web
   - **URIs de redireccionamiento autorizados**: 
     ```
     https://[tu-proyecto-id].supabase.co/auth/v1/callback
     ```
6. Copia el **Client ID** y **Client Secret**
7. En Supabase: Authentication > Providers > Google
   - Habilita Google
   - Pega Client ID y Client Secret

### 3. X (Twitter) OAuth:
1. Ve a [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Crea una nueva App
3. Ve a **Keys and tokens**
4. En **OAuth 2.0 Client ID and Client Secret**, genera las credenciales
5. Configura:
   - **Callback URI**: 
     ```
     https://[tu-proyecto-id].supabase.co/auth/v1/callback
     ```
6. Copia **Client ID** y **Client Secret**
7. En Supabase: Authentication > Providers > Twitter
   - Habilita Twitter
   - Pega Client ID y Client Secret

### 4. Configurar URL de redireccionamiento:
En Supabase > Authentication > URL Configuration:
- **Site URL**: `http://localhost:3001` (para desarrollo)
- **Redirect URLs**: Agregar:
  ```
  http://localhost:3001
  http://localhost:3001/auth/callback
  ```

## URLs importantes:
- Tu Supabase URL: `https://onrlmkyqzzvguribggbr.supabase.co`
- Callback URL: `https://onrlmkyqzzvguribggbr.supabase.co/auth/v1/callback`