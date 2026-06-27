import { useEffect, useState } from 'react'
import { vehiclesService } from '../../services/api'

interface ApiVehicle {
  id: string
  plate: string
  model: string
  year: number | null
  driver: string | null
  fuel: number | null
  kmToday: number | null
  cargo: number | null
  status: 'AVAILABLE' | 'IN_ROUTE' | 'MAINTENANCE'
}

const statusLabel: Record<string, string> = {
  IN_ROUTE: 'En ruta',
  AVAILABLE: 'Disponible',
  MAINTENANCE: 'Mantenimiento',
}
const statusBadge: Record<string, string> = {
  IN_ROUTE: 'bg-green-50 text-green-700',
  AVAILABLE: 'bg-blue-50 text-blue-700',
  MAINTENANCE: 'bg-red-50 text-red-600',
}

function FuelBar({ value }: { value: number | null }) {
  if (value === null) return <span className="text-gray-300">—</span>
  const color = value > 60 ? 'bg-green-500' : value > 30 ? 'bg-amber-400' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-gray-700 font-medium w-8 text-right">{value}%</span>
    </div>
  )
}

function VehicleCard({ vehicle: v }: { vehicle: ApiVehicle }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium text-gray-900">{v.plate}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[v.status]}`}>
          {statusLabel[v.status]}
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4">
        {v.model}{v.year ? ` · ${v.year}` : ''}
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Conductor</span>
          <span className="font-medium text-gray-700">{v.driver ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Carga</span>
          <span className="font-medium text-gray-700">{v.cargo !== null ? `${v.cargo} t` : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Km hoy</span>
          <span className="font-medium text-gray-700">{v.kmToday !== null ? `${v.kmToday} km` : '—'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Combustible</span>
          <div className="w-32">
            <FuelBar value={v.fuel} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FlotaView() {
  const [vehicles, setVehicles] = useState<ApiVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    vehiclesService.getAll()
      .then(setVehicles)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">
      Cargando flota...
    </div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-64 text-sm text-red-500">
      Error: {error}
    </div>
  )

  const enRuta = vehicles.filter(v => v.status === 'IN_ROUTE').length
  const disponibles = vehicles.filter(v => v.status === 'AVAILABLE').length
  const mantenimiento = vehicles.filter(v => v.status === 'MAINTENANCE').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'En ruta', value: enRuta, color: 'text-green-600' },
          { label: 'Disponibles', value: disponibles, color: 'text-blue-600' },
          { label: 'Mantenimiento', value: mantenimiento, color: 'text-red-500' },
          { label: 'Total', value: vehicles.length, color: 'text-gray-900' },
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">{item.label}</div>
            <div className={`text-2xl font-medium ${item.color}`}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {vehicles.map(vehicle => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} />
        ))}
      </div>
    </div>
  )
}