'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error Global</h2>
            <p className="text-gray-400 mb-4">
              Ha ocurrido un error crítico en la aplicación.
            </p>
            <button
              onClick={reset}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reiniciar Aplicación
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}