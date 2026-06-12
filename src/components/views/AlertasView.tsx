import { alerts } from '../../data/mockdata'
import type { AlertSeverity } from '../../types'

const severityStyles: Record<AlertSeverity, { badge: string; icon: string }> = {
  critica: { badge: 'bg-red-50 text-red-600', icon: 'bg-red-50 text-red-500' },
  media: { badge: 'bg-amber-50 text-amber-700', icon: 'bg-amber-50 text-amber-500' },
  informativa: { badge: 'bg-blue-50 text-blue-600', icon: 'bg-blue-50 text-blue-500' },
}

const severityLabel: Record<AlertSeverity, string> = {
  critica: 'Crítica',
  media: 'Media',
  informativa: 'Informativa',
}

const incidentTypes = [
  { label: 'Retrasos por tráfico', count: 5, max: 5, color: 'bg-amber-400' },
  { label: 'Mecánicas', count: 3, max: 5, color: 'bg-red-400' },
  { label: 'Combustible bajo', count: 2, max: 5, color: 'bg-amber-300' },
  { label: 'Documentación', count: 1, max: 5, color: 'bg-blue-400' },
]

export default function AlertasView() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">Alertas activas</span>
        </div>
        <div className="divide-y divide-gray-50">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 px-5 py-4">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-sm ${severityStyles[alert.severity].icon}`}>
                {alert.icon === 'engine' && '⚙'}
                {alert.icon === 'alert' && '⚠'}
                {alert.icon === 'fuel' && '⛽'}
                {alert.icon === 'calendar' && '📅'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] text-gray-400">{alert.time}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${severityStyles[alert.severity].badge}`}>
                    {severityLabel[alert.severity]}
                  </span>
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
              { label: 'Críticas', value: alerts.filter(a => a.severity === 'critica').length, color: 'text-red-500' },
              { label: 'Medias', value: alerts.filter(a => a.severity === 'media').length, color: 'text-amber-500' },
              { label: 'Informativas', value: alerts.filter(a => a.severity === 'informativa').length, color: 'text-blue-500' },
              { label: 'Total activas', value: alerts.length, color: 'text-gray-700' },
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