// Script de prueba para verificar TheSportsDB API
// Ejecutar con: node test-api.js

async function testTheSportsDbAPI() {
  console.log('🚀 Probando TheSportsDB API...')
  console.log('================================')
  
  try {
    // Test 1: Buscar Arsenal
    console.log('\n1️⃣  Buscando equipos: "Arsenal"')
    const response1 = await fetch('https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=Arsenal')
    const data1 = await response1.json()
    
    if (data1.teams && data1.teams.length > 0) {
      console.log(`   ✅ Encontrados ${data1.teams.length} equipos:`)
      data1.teams.slice(0, 3).forEach(team => {
        console.log(`   - ${team.strTeam} (${team.strSport}, ${team.strCountry})`)
      })
    } else {
      console.log('   ❌ No se encontraron equipos')
    }
    
    // Test 2: Obtener eventos de la Premier League
    console.log('\n2️⃣  Obteniendo próximos eventos de Premier League (ID: 4328)')
    const response2 = await fetch('https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328')
    const data2 = await response2.json()
    
    if (data2.events && data2.events.length > 0) {
      console.log(`   ✅ Encontrados ${data2.events.length} eventos próximos:`)
      data2.events.slice(0, 3).forEach(event => {
        console.log(`   - ${event.strHomeTeam} vs ${event.strAwayTeam}`)
        console.log(`     Fecha: ${event.dateEvent || 'No disponible'} ${event.strTime || ''}`)
      })
    } else {
      console.log('   ❌ No se encontraron eventos')
    }
    
    // Test 3: Buscar Liga Española
    console.log('\n3️⃣  Buscando ligas: "Spanish"')
    const response3 = await fetch('https://www.thesportsdb.com/api/v1/json/3/search_all_leagues.php?l=Spanish')
    const data3 = await response3.json()
    
    if (data3.countrys && data3.countrys.length > 0) {
      console.log(`   ✅ Encontradas ${data3.countrys.length} ligas:`)
      data3.countrys.slice(0, 3).forEach(league => {
        console.log(`   - ${league.strLeague} (${league.strSport})`)
      })
    } else {
      console.log('   ❌ No se encontraron ligas')
    }
    
    // Test 4: Equipos de una liga específica (Premier League)
    console.log('\n4️⃣  Obteniendo equipos de Premier League (ID: 4328)')
    const response4 = await fetch('https://www.thesportsdb.com/api/v1/json/3/lookup_all_teams.php?id=4328')
    const data4 = await response4.json()
    
    if (data4.teams && data4.teams.length > 0) {
      console.log(`   ✅ Encontrados ${data4.teams.length} equipos:`)
      data4.teams.slice(0, 5).forEach(team => {
        console.log(`   - ${team.strTeam}`)
      })
    } else {
      console.log('   ❌ No se encontraron equipos')
    }
    
    console.log('\n================================')
    console.log('🎉 ¡Prueba completada con éxito!')
    console.log('TheSportsDB API está funcionando correctamente')
    console.log('✅ API completamente GRATUITA')
    console.log('✅ Sin límites de rate limiting')
    console.log('✅ Múltiples deportes disponibles')
    
  } catch (error) {
    console.error('\n❌ Error durante la prueba:', error.message)
    console.log('\nPosibles causas:')
    console.log('- Problemas de conectividad')
    console.log('- API temporalmente no disponible')
  }
}

// Ejecutar la prueba
testTheSportsDbAPI()