'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DiagnosticResult {
  name: string
  status: 'success' | 'error' | 'loading'
  message: string
  details?: any
}

export default function DatabaseDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostics = async () => {
    setIsRunning(true)
    const diagnostics: DiagnosticResult[] = []

    // Test 1: Basic connection
    diagnostics.push({ name: 'Conexión básica', status: 'loading', message: 'Verificando...' })
    setResults([...diagnostics])

    try {
      const { error } = await supabase.from('sports_categories').select('count', { count: 'exact' }).limit(1)
      if (error) {
        diagnostics[0] = { 
          name: 'Conexión básica', 
          status: 'error', 
          message: `Error: ${error.message}`,
          details: error
        }
      } else {
        diagnostics[0] = { 
          name: 'Conexión básica', 
          status: 'success', 
          message: 'Conexión establecida correctamente'
        }
      }
    } catch (error: any) {
      diagnostics[0] = { 
        name: 'Conexión básica', 
        status: 'error', 
        message: `Error de conexión: ${error.message}`,
        details: error
      }
    }
    setResults([...diagnostics])

    // Test 2: Sports categories table
    diagnostics.push({ name: 'Tabla sports_categories', status: 'loading', message: 'Verificando...' })
    setResults([...diagnostics])

    try {
      const { data, error } = await supabase.from('sports_categories').select('*').limit(5)
      if (error) {
        diagnostics[1] = { 
          name: 'Tabla sports_categories', 
          status: 'error', 
          message: `Error: ${error.message}`,
          details: error
        }
      } else {
        diagnostics[1] = { 
          name: 'Tabla sports_categories', 
          status: 'success', 
          message: `Tabla existe con ${data?.length || 0} registros de muestra`
        }
      }
    } catch (error: any) {
      diagnostics[1] = { 
        name: 'Tabla sports_categories', 
        status: 'error', 
        message: `Error: ${error.message}`,
        details: error
      }
    }
    setResults([...diagnostics])

    // Test 3: Leagues table
    diagnostics.push({ name: 'Tabla leagues', status: 'loading', message: 'Verificando...' })
    setResults([...diagnostics])

    try {
      const { data, error } = await supabase.from('leagues').select('*').limit(5)
      if (error) {
        diagnostics[2] = { 
          name: 'Tabla leagues', 
          status: 'error', 
          message: `Error: ${error.message}`,
          details: error
        }
      } else {
        diagnostics[2] = { 
          name: 'Tabla leagues', 
          status: 'success', 
          message: `Tabla existe con ${data?.length || 0} registros de muestra`
        }
      }
    } catch (error: any) {
      diagnostics[2] = { 
        name: 'Tabla leagues', 
        status: 'error', 
        message: `Error: ${error.message}`,
        details: error
      }
    }
    setResults([...diagnostics])

    // Test 4: Betting challenges table
    diagnostics.push({ name: 'Tabla betting_challenges', status: 'loading', message: 'Verificando...' })
    setResults([...diagnostics])

    try {
      const { data, error } = await supabase.from('betting_challenges').select('*').limit(5)
      if (error) {
        diagnostics[3] = { 
          name: 'Tabla betting_challenges', 
          status: 'error', 
          message: `Error: ${error.message}`,
          details: error
        }
      } else {
        diagnostics[3] = { 
          name: 'Tabla betting_challenges', 
          status: 'success', 
          message: `Tabla existe con ${data?.length || 0} registros de muestra`
        }
      }
    } catch (error: any) {
      diagnostics[3] = { 
        name: 'Tabla betting_challenges', 
        status: 'error', 
        message: `Error: ${error.message}`,
        details: error
      }
    }
    setResults([...diagnostics])

    // Test 5: Variables de entorno
    diagnostics.push({ name: 'Variables de entorno', status: 'loading', message: 'Verificando...' })
    setResults([...diagnostics])

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      diagnostics[4] = { 
        name: 'Variables de entorno', 
        status: 'error', 
        message: 'Variables de entorno faltantes',
        details: { 
          url: supabaseUrl ? 'configurada' : 'faltante',
          key: supabaseKey ? 'configurada' : 'faltante'
        }
      }
    } else {
      diagnostics[4] = { 
        name: 'Variables de entorno', 
        status: 'success', 
        message: 'Variables de entorno configuradas correctamente'
      }
    }
    setResults([...diagnostics])

    setIsRunning(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return '✅'
      case 'error': return '❌'
      case 'loading': return '⏳'
    }
  }

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'error': return 'text-red-400'
      case 'loading': return 'text-yellow-400'
    }
  }

  return (
    <div className="bg-[#2a2d47] border border-gray-600 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">🔍 Diagnóstico de Base de Datos</h3>
        <button 
          onClick={runDiagnostics}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          {isRunning ? 'Ejecutando...' : '🔄 Ejecutar'}
        </button>
      </div>
      
      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-start space-x-3">
            <span className="text-lg">{getStatusIcon(result.status)}</span>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{result.name}</span>
                {result.status === 'loading' && (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <div className={`text-sm ${getStatusColor(result.status)} mt-1`}>
                {result.message}
              </div>
              {result.details && result.status === 'error' && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-400 cursor-pointer hover:text-white">
                    Ver detalles técnicos
                  </summary>
                  <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.length > 0 && !isRunning && (
        <div className="mt-4 pt-3 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            {results.filter(r => r.status === 'success').length} de {results.length} pruebas pasaron correctamente
          </div>
        </div>
      )}
    </div>
  )
}