import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1a1d29] text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold mb-4">Página No Encontrada</h2>
        <p className="text-gray-400 mb-4">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Volver al Inicio
          </button>
        </Link>
      </div>
    </div>
  )
}