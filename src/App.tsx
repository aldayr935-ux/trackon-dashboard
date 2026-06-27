import { useState, useEffect } from 'react'
import type { ViewId } from './types'
import { useAuth } from './hooks/useAuth'
import { dashboardService } from './services/api'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import AssistantPanel from './components/AssistantPanel'
import ResumenView from './components/views/ResumenView'
import FlotaView from './components/views/FlotaView'
import EnviosView from './components/views/EnviosView'
import RutasView from './components/views/RutasView'
import AlertasView from './components/views/AlertasView'
import LoginView from './components/views/LoginView'
import OrientationGuard from './components/OrientationGuard'

const viewTitles: Record<ViewId, string> = {
  resumen: 'Resumen general',
  flota: 'Flota de vehículos',
  envios: 'Envíos activos',
  rutas: 'Rutas y tiempos',
  alertas: 'Alertas del sistema',
}

export default function App() {
  const { user, loading } = useAuth()
  const [activeView, setActiveView] = useState<ViewId>('resumen')
  const [showAssistant, setShowAssistant] = useState(false)
  const [badges, setBadges] = useState<Partial<Record<ViewId, number>>>({})
  const updateAlertBadge = (unread: number) => {
  setBadges(prev => ({ ...prev, alertas: unread }))
}

  useEffect(() => {
    if (!user) return

    dashboardService.getStats().then((stats) => {
      const shipmentsInTransit = stats.shipments.byStatus.find(
        (s: { status: string; count: number }) => s.status === 'IN_TRANSIT'
      )?.count ?? 0

      setBadges({
        envios: shipmentsInTransit,
        alertas: stats.alerts.unread,
      })
    }).catch(() => {})
  }, [user])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-sm text-gray-400">Cargando...</div>
    </div>
  )

  if (!user) return <LoginView />

  return (
    <OrientationGuard>
      <div className="flex h-screen bg-gray-50 font-sans">
        <Sidebar
          activeView={activeView}
          onNavigate={setActiveView}
          badges={badges}
        />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar title={viewTitles[activeView]} />
          <main className="flex-1 overflow-y-auto p-6">
            {activeView === 'resumen' && <ResumenView />}
            {activeView === 'flota' && <FlotaView />}
            {activeView === 'envios' && <EnviosView />}
            {activeView === 'rutas' && <RutasView />}
            {activeView === 'alertas' && (
              <AlertasView onAlertsChange={updateAlertBadge} />
              )}
          </main>
        </div>

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