import { useState } from 'react'
import type { ViewId } from './types'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AssistantPanel from './components/AssistantPanel'
import ResumenView from './components/views/ResumenView'
import FlotaView from './components/views/FlotaView'
import EnviosView from './components/views/EnviosView'
import RutasView from './components/views/RutasView'
import AlertasView from './components/views/AlertasView'
import OrientationGuard from './components/OrientationGuard'

const viewTitles: Record<ViewId, string> = {
  resumen: 'Resumen general',
  flota: 'Flota de vehículos',
  envios: 'Envíos activos',
  rutas: 'Rutas y tiempos',
  alertas: 'Alertas del sistema',
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewId>('resumen')
  const [showAssistant, setShowAssistant] = useState(false)

  return (
    <OrientationGuard>
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar title={viewTitles[activeView]} />
        <main className="flex-1 overflow-y-auto p-6">
          {activeView === 'resumen' && <ResumenView />}
          {activeView === 'flota' && <FlotaView />}
          {activeView === 'envios' && <EnviosView />}
          {activeView === 'rutas' && <RutasView />}
          {activeView === 'alertas' && <AlertasView />}
        </main>
      </div>

      {/* Botón flotante */}
      <button
        onClick={() => setShowAssistant(prev => !prev)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center text-xl transition-colors cursor-pointer z-40"
        aria-label="Abrir asistente"
      >
        {showAssistant ? '×' : '💬'}
      </button>

      {showAssistant && <AssistantPanel onClose={() => setShowAssistant(false)} />}
    </div>
    </OrientationGuard>
  )
}