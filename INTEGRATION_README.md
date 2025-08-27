# 🎰 Frontend Integrado con Protocolo de Apuestas Descentralizadas

## 🎯 ¿Qué se ha implementado?

Hemos integrado completamente el frontend de la casa de apuestas deportivas con el protocolo de contratos inteligentes desplegado en **Polygon Amoy Testnet**.

## 🔗 Integración Completada

### ✅ Contratos Conectados
- **MockUSDC**: `0xBC0F832569966f667a915c5eFE3A787b31a2C751`
- **BettingProtocol**: `0xAa41f121D883415F9cD70Ce2c7F9A453Ada0Fa9f`
- **Red**: Polygon Amoy Testnet (Chain ID: 80002)

### ✅ Funcionalidades Implementadas

#### 1. Conexión de Wallet
- Conectar/desconectar MetaMask
- Cambio automático a Polygon Amoy Testnet
- Visualización de balance MATIC y USDC
- Detección automática de cambios de red/cuenta

#### 2. Gestión de USDC
- Mintear USDC de prueba (solo testnet)
- Visualización de balance en tiempo real
- Aprobaciones automáticas para transacciones

#### 3. Creación de Apuestas Reales
- **Apuestas Simples**: Múltiples participantes compitiendo
- **Apuestas 1 vs 1**: Modo clásico y mercado
- **Apuestas Grupales**: Grupos balanceados automáticamente
- **Torneos**: Sistema de torneos con múltiples participantes

#### 4. Modos de Resolución
- **EXACT**: Solo gana quien acierta exactamente
- **CLOSEST**: Gana quien más se acerca
- **MULTI_WINNER**: Múltiples ganadores posibles

## 🚀 Cómo Usar la Aplicación

### Paso 1: Preparar Wallet
1. Instala **MetaMask** en tu navegador
2. Agrega la red **Polygon Amoy Testnet**:
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency: `MATIC`

### Paso 2: Obtener MATIC de Prueba
1. Ve a [Polygon Faucet](https://faucet.polygon.technology/)
2. Selecciona "Mumbai/Amoy Testnet"
3. Ingresa tu dirección y obtén MATIC gratis

### Paso 3: Usar la Aplicación
1. Abre la aplicación en `http://localhost:3000`
2. Haz clic en "**Conectar Wallet**"
3. Autoriza la conexión en MetaMask
4. Si no estás en la red correcta, haz clic en "**Cambiar a Polygon Amoy**"

### Paso 4: Obtener USDC de Prueba
1. En el sidebar derecho, busca "**Mintear USDC de Prueba**"
2. Ingresa la cantidad (ej. 100)
3. Haz clic en "**Mintear 100 USDC**"
4. Confirma la transacción en MetaMask

### Paso 5: Crear tu Primera Apuesta
1. Haz clic en "**+ Crear Reto**"
2. Completa el formulario:
   - **Tipo**: Apuesta Simple o 1 vs 1
   - **Título**: "¿Quién ganará el partido?"
   - **Monto**: Cantidad en USDC
   - **Participantes**: Máximo de jugadores
   - **Modo**: Exacto, Más cercano, etc.
3. Haz clic en "**Crear Apuesta**"
4. Confirma la transacción en MetaMask

## 🛠 Arquitectura Técnica

### Frontend Stack
- **Next.js 15**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **Ethers.js 5**: Interacción con blockchain

### Smart Contracts
- **Solidity 0.8.28**: Lenguaje de contratos
- **OpenZeppelin**: Librerías de seguridad
- **Hardhat**: Framework de desarrollo
- **UUPS Proxy**: Contratos actualizables

### Funciones del Protocolo Integradas

#### Apuestas Simples
```typescript
createSimpleBet(resolutionMode, stakeAmount, maxParticipants)
joinBet(betId, predictedValue)
resolveSimpleBet(betId, winningValue)
```

#### Apuestas 1 vs 1
```typescript
createOneVsOneBet(prediction, stakeAmount, mode)
offerAgainstBet(betId, amount)
acceptOffer(betId, offerIds[])
resolveOneVsOneBet(betId, outcome)
```

#### Apuestas Grupales
```typescript
createBalancedGroupBet(resolutionMode, stakeAmount, maxParticipants, groupSize)
joinBalancedBet(betId, predictedValue)
resolveBalancedGroupBet(betId, winningValue)
```

#### Torneos
```typescript
createTournament(tournamentType, resolutionMode, maxParticipants, allowIdenticalBets, registrationEndTime)
registerForTournament(tournamentId)
resolveTournament(tournamentId, winners[], isLarge)
```

## 📊 Datos del Protocolo

### Configuración Actual
- **Fee General**: 5% (500 basis points)
- **Fee Torneos**: 3% (300 basis points)
- **Máximo Participantes**: 100 por apuesta
- **Tokens Soportados**: MockUSDC (testnet)

### Tipos de Apuesta Disponibles
1. **SIMPLE**: Todos vs todos
2. **TOURNAMENT**: Sistema de torneos
3. **GROUP_BALANCED**: Grupos balanceados
4. **ONE_VS_ONE**: Uno contra uno

### Modos de Resolución
1. **EXACT**: Predicción exacta
2. **CLOSEST**: Más cercano gana
3. **MULTI_WINNER**: Múltiples ganadores

## 🔒 Seguridad Implementada

### En Smart Contracts
- ✅ **ReentrancyGuard**: Protección contra ataques de reentrancy
- ✅ **AccessControl**: Control de acceso por roles
- ✅ **Pausable**: Capacidad de pausar en emergencias
- ✅ **UUPS Upgradeable**: Actualizaciones seguras
- ✅ **SafeERC20**: Transferencias seguras de tokens

### En Frontend
- ✅ **Validación de Red**: Solo permite Polygon Amoy
- ✅ **Validación de Balance**: Verifica fondos suficientes
- ✅ **Manejo de Errores**: Captura y muestra errores claramente
- ✅ **Estado de Transacciones**: Loading states apropiados

## 🚨 Importante para Testing

### Solo Testnet
- **⚠️ NUNCA uses fondos reales**
- **⚠️ Solo funciona en Polygon Amoy Testnet**
- **⚠️ Los contratos NO están en mainnet**

### Limitaciones Actuales
- Los oráculos deben ser manejados manualmente por el admin
- La resolución de apuestas requiere intervención manual
- Los datos históricos no se persisten en base de datos

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Construcción
npm run build        # Build para producción
npm run start        # Iniciar servidor de producción

# Linting
npm run lint         # Verificar código
```

## 🌟 Próximos Pasos

### Mejoras Inmediatas
1. **Sistema de Oráculos**: Integración con Chainlink
2. **Base de Datos**: Persistencia de datos históricos  
3. **Notificaciones**: Alertas en tiempo real
4. **UI/UX**: Mejoras de interfaz de usuario

### Funcionalidades Futuras
1. **Mobile App**: Versión móvil
2. **Analytics**: Dashboard de estadísticas
3. **Social Features**: Sistema de reputación
4. **Multi-token**: Soporte para múltiples tokens

## 📞 Soporte

Si encuentras problemas:
1. Verifica que tengas MetaMask instalado
2. Confirma que estás en Polygon Amoy Testnet
3. Asegúrate de tener MATIC para gas fees
4. Revisa la consola del navegador para errores

---

**🎉 ¡La integración está completa y lista para usar!**

*Última actualización: Agosto 2024*