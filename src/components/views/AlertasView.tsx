import { useEffect, useState } from 'react'
import { alertsService } from '../../services/api'

interface ApiAlert {
  id: string
  message: string
  type: 'INFO' | 'WARNING' | 'ERROR'
  read: boolean
  createdAt: string
  shipment: { trackingCode: string } | null
}

const typeStyles: Record<string, { badge: string; icon: string; emoji: string }> = {
  ERROR: { badge: 'bg-red-50 text-red-600', icon: 'bg-red-50 text-red-500', emoji: '⚠' },
  WARNING: { badge: 'bg-amber-50 text-amber-700', icon: 'bg-amber-50 text-amber-500', emoji: '⚙' },
  INFO: { badge: 'bg-blue-50 text-blue-600', icon: 'bg-blue-50 text-blue-500', emoji: 'ℹ' },
}
const typeLabel: Record<string, string> = {
  ERROR: 'Crítica',
  WARNING: 'Media',
  INFO: 'Informativa',
}

const incidentTypes = [
  { label: 'Retrasos por tráfico', count: 5, max: 5, color: 'bg-amber-400' },
  { label: 'Mecánicas', count: 3, max: 5, color: 'bg-red-400' },
  { label: 'Combustible bajo', count: 2, max: 5, color: 'bg-amber-300' },
  { label: 'Documentación', count: 1, max: 5, color: 'bg-blue-400' },
]

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
}

export default function AlertasView() {
  const [alerts, setAlerts] = useState<ApiAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    alertsService.getAll()
      .then(setAlerts)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const markAsRead = async (id: string) => {
    await alertsService.markAsRead(id)
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">Cargando alertas...</div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-64 text-sm text-red-500">Error: {error}</div>
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Alertas activas</span>
          {alerts.some(a => !a.read) && (
            <button
              onClick={async () => {
                await alertsService.markAllAsRead()
                setAlerts(prev => prev.map(a => ({ ...a, read: true })))
              }}
              className="text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {alerts.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-gray-400">No hay alertas</p>
          ) : alerts.map(alert => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 px-5 py-4 ${!alert.read ? 'bg-gray-50/50' : ''}`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${typeStyles[alert.type].icon}`}>
                {typeStyles[alert.type].emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-gray-400">{formatTime(alert.createdAt)}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${typeStyles[alert.type].badge}`}>
                    {typeLabel[alert.type]}
                  </span>
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-[11px] text-blue-500 hover:underline cursor-pointer ml-auto"
                    >
                      Marcar leída
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-medium text-gray-900 mb-4">Incidencias por tipo — junio</div>
          <div className="space-y-3">
            {incidentTypes.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-700">{item.count}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${(item.count / item.max) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400">
            11 incidencias en junio —{' '}
            <span className="text-green-600 font-medium">↓ 18% vs mayo</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="text-sm font-medium text-gray-900 mb-3">Resumen rápido</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Críticas', value: alerts.filter(a => a.type === 'ERROR').length, color: 'text-red-500' },
              { label: 'Medias', value: alerts.filter(a => a.type === 'WARNING').length, color: 'text-amber-500' },
              { label: 'Informativas', value: alerts.filter(a => a.type === 'INFO').length, color: 'text-blue-500' },
              { label: 'Sin leer', value: alerts.filter(a => !a.read).length, color: 'text-gray-700' },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                <div className="text-[11px] text-gray-400">{item.label}</div>
                <div className={`text-xl font-medium mt-0.5 ${item.color}`}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}