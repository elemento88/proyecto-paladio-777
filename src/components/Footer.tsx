export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#1a1d29] to-[#2a2d47] border-t border-gray-600 mt-12 w-full relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P77</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Paladio 77</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Plataforma de retos deportivos descentralizada líder en Web3. 
              Apuesta con total transparencia, seguridad blockchain y pagos instantáneos.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Plataforma</h4>
            <ul className="space-y-3">
              <li><a href="/sports" className="text-gray-300 hover:text-white transition-colors text-sm">Deportes</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Crear Reto</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Mis Retos</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Estadísticas</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide mb-4">Soporte</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Centro de Ayuda</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Términos y Condiciones</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Política de Privacidad</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Juego Responsable</a></li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="border-t border-gray-600 pt-8 mb-8">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Seguridad Blockchain</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Pagos Instantáneos</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
              </div>
              <span className="text-sm font-medium">100% Descentralizado</span>
            </div>

            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-yellow-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-sm font-medium">Totalmente Verificable</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2024 Paladio 77. Plataforma de retos deportivos descentralizada.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>Web3 Enabled</span>
              <span>•</span>
              <span>SSL Certificado</span>
              <span>•</span>
              <span>Auditoría Blockchain</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}