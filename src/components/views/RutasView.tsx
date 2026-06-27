import { useEffect, useState } from 'react'
import { routesService } from '../../services/api'

interface ApiRoute {
  id: string
  name: string
  origin: string
  destination: string
  distance: number | null
  avgTime: number | null
  punctuality: number | null
  efficiency: 'ALTA' | 'MEDIA' | 'BAJA'
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  vehicle: { plate: string; model: string } | null
}

const efficiencyLabel: Record<string, string> = {
  ALTA: 'Alta',
  MEDIA: 'Media',
  BAJA: 'Baja',
}
const efficiencyBadge: Record<string, string> = {
  ALTA: 'bg-green-50 text-green-700',
  MEDIA: 'bg-amber-50 text-amber-700',
  BAJA: 'bg-red-50 text-red-600',
}
const punctualityColor = (val: number | null) => {
  if (val === null) return 'text-gray-400'
  if (val >= 90) return 'text-green-600'
  if (val >= 75) return 'text-amber-500'
  return 'text-red-500'
}

export default function RutasView() {
  const [routes, setRoutes] = useState<ApiRoute[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    routesService.getAll()
      .then(setRoutes)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">
      Cargando rutas...
    </div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-64 text-sm text-red-500">
      Error: {error}
    </div>
  )

  const avgPunctuality = routes.length > 0
    ? Math.round(routes.reduce((acc, r) => acc + (r.punctuality ?? 0), 0) / routes.length)
    : 0

  return (
    <div className="space-y-4">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Rutas activas', value: routes.filter(r => r.status === 'ACTIVE').length, suffix: '' },
          { label: 'Puntualidad promedio', value: avgPunctuality, suffix: '%' },
          { label: 'Alta eficiencia', value: routes.filter(r => r.efficiency === 'ALTA').length, suffix: '' },
          { label: 'Total rutas', value: routes.length, suffix: '' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">{item.label}</div>
            <div className="text-2xl font-medium text-gray-900">{item.value}{item.suffix}</div>
          </div>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Ruta', 'Trayecto', 'Distancia', 'Tiempo prom.', 'Puntualidad', 'Eficiencia', 'Vehículo'].map(h => (
                <th key={h} className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-4 py-3 first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                  No hay rutas registradas
                </td>
              </tr>
            ) : routes.map((r, i) => (
              <tr key={r.id} className={i < routes.length - 1 ? 'border-b border-gray-50' : ''}>
                <td className="px-5 py-3 text-xs font-medium text-gray-800">{r.name}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{r.origin} → {r.destination}</td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {r.distance !== null ? `${r.distance} km` : '—'}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {r.avgTime !== null ? `${r.avgTime} h` : '—'}
                </td>
                <td className="px-4 py-3 text-xs">
                  <span className={`font-medium ${punctualityColor(r.punctuality)}`}>
                    {r.punctuality !== null ? `${r.punctuality}%` : '—'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${efficiencyBadge[r.efficiency]}`}>
                    {efficiencyLabel[r.efficiency]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {r.vehicle ? r.vehicle.plate : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}