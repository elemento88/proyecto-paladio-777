# 🚀 Configuración Automática de Base de Datos Supabase

## 📋 Instrucciones Paso a Paso

### 1. Accede a Supabase Dashboard
- Ve a: https://supabase.com/dashboard/project/onrlmkyqzzvguribggbr
- Haz clic en **"SQL Editor"** en el menú izquierdo

### 2. Ejecuta los archivos SQL en orden
He dividido el SQL en 4 partes para evitar errores. Ejecuta cada parte por separado:

#### PARTE 1: Extensions y Categorías de Deportes
1. En SQL Editor, haz clic en **"New Query"**
2. Copia y pega el contenido de `create-tables-part1.sql`
3. Haz clic en **"Run"** (▶️)
4. Verifica que muestre: ✅ Success

#### PARTE 2: Ligas
1. **"New Query"**
2. Copia y pega el contenido de `create-tables-part2.sql`
3. **"Run"** (▶️)
4. Verifica: ✅ Success

#### PARTE 3: Usuarios y Retos
1. **"New Query"**
2. Copia y pega el contenido de `create-tables-part3.sql`
3. **"Run"** (▶️)
4. Verifica: ✅ Success

#### PARTE 4: Tablas Adicionales
1. **"New Query"**
2. Copia y pega el contenido de `create-tables-part4.sql`
3. **"Run"** (▶️)
4. Verifica: ✅ Success

### 3. Verifica la Creación
Después de ejecutar las 4 partes:
1. Ve a http://localhost:3000/sports
2. Haz clic en **"🔄 Ejecutar"** en el diagnóstico
3. Deberías ver ✅ en todas las pruebas

## 🎯 Contenido de cada archivo:

- **part1.sql**: Extensions + sports_categories
- **part2.sql**: leagues
- **part3.sql**: user_profiles + betting_challenges  
- **part4.sql**: user_bets + transactions + user_statistics

## ✅ Al completar:
- Los errores de consola desaparecerán
- La barra de búsqueda funcionará correctamente
- Todas las funcionalidades de la aplicación estarán disponibles

## 🆘 Si hay errores:
- Copia el mensaje de error completo
- Revisa que cada parte se ejecute en orden
- Asegúrate de que las partes anteriores hayan sido exitosas antes de continuar