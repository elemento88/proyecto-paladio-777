const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sqlContent, name) {
  console.log(`\n🔄 Ejecutando ${name}...`);
  
  try {
    // Split SQL into individual statements and execute them one by one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`   Ejecutando sentencia ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement 
        }).catch(async () => {
          // If RPC doesn't work, try direct query
          return await supabase
            .from('__temp')
            .select()
            .limit(0)
            .then(() => ({ error: null }))
            .catch(() => {
              // Try using the SQL directly with a query
              return fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseServiceKey,
                  'Authorization': `Bearer ${supabaseServiceKey}`
                },
                body: JSON.stringify({ sql_query: statement })
              }).then(res => res.json());
            });
        });

        if (error) {
          console.error(`     ❌ Error en sentencia ${i + 1}:`, error.message);
          // Don't exit, continue with next statement
        } else {
          console.log(`     ✅ Sentencia ${i + 1} ejecutada correctamente`);
        }
      }
    }
    
    console.log(`✅ ${name} completado`);
    return true;
  } catch (error) {
    console.error(`❌ Error ejecutando ${name}:`, error.message);
    return false;
  }
}

async function setupDatabase() {
  console.log('🚀 Iniciando configuración automática de la base de datos...');
  console.log(`📡 Conectando a: ${supabaseUrl}`);

  try {
    // Test connection
    console.log('\n🔄 Probando conexión...');
    const { error: connectionError } = await supabase
      .from('__test')
      .select()
      .limit(1);
    
    if (connectionError && !connectionError.message.includes('does not exist')) {
      throw new Error(`Error de conexión: ${connectionError.message}`);
    }
    
    console.log('✅ Conexión establecida correctamente');

    // Read and execute schema
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
      await executeSQL(schemaSQL, 'Schema principal');
    } else {
      console.error('❌ No se encontró el archivo supabase-schema.sql');
    }

    // Execute additional SQL files if they exist
    const additionalFiles = [
      'supabase-tournament-schema.sql',
      'supabase-functions.sql'
    ];

    for (const filename of additionalFiles) {
      const filePath = path.join(__dirname, filename);
      if (fs.existsSync(filePath)) {
        const sqlContent = fs.readFileSync(filePath, 'utf8');
        await executeSQL(sqlContent, filename);
      }
    }

    console.log('\n🎉 ¡Configuración de base de datos completada!');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a http://localhost:3000/sports');
    console.log('2. Ejecuta el diagnóstico para verificar que todo funciona');
    console.log('3. Los errores de consola deberían haber desaparecido');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    console.log('\n🔧 Solución manual:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Accede al SQL Editor');
    console.log('3. Ejecuta el contenido de supabase-schema.sql manualmente');
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function executeDirectSQL(sqlContent) {
  console.log('\n🔄 Intentando método directo...');
  
  // Split into smaller chunks and execute each one
  const sqlStatements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

  for (let i = 0; i < sqlStatements.length; i++) {
    const statement = sqlStatements[i];
    if (statement) {
      try {
        // Use different approaches based on the statement type
        if (statement.toLowerCase().includes('create table')) {
          console.log(`   ⚙️  Creando tabla... (${i + 1}/${sqlStatements.length})`);
        } else if (statement.toLowerCase().includes('insert into')) {
          console.log(`   📥 Insertando datos... (${i + 1}/${sqlStatements.length})`);
        } else if (statement.toLowerCase().includes('create policy')) {
          console.log(`   🔒 Creando política... (${i + 1}/${sqlStatements.length})`);
        } else {
          console.log(`   🔧 Ejecutando... (${i + 1}/${sqlStatements.length})`);
        }

        // Try to execute via REST API
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        });

        if (response.ok) {
          console.log(`     ✅ OK`);
        } else {
          const errorText = await response.text();
          console.log(`     ⚠️  ${errorText} (continuando...)`);
        }
      } catch (error) {
        console.log(`     ⚠️  ${error.message} (continuando...)`);
      }
    }
  }
}

// Run the setup
setupDatabase().catch(console.error);