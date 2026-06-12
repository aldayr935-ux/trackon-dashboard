import type { Vehicle, VehicleStatus } from '../../types'
import { vehicles } from '../../data/mockdata'

const statusLabel: Record<VehicleStatus, string> = {
  'en-ruta': 'En ruta',
  'disponible': 'Disponible',
  'mantenimiento': 'Mantenimiento',
  'cargando': 'Cargando',
}

const statusBadge: Record<VehicleStatus, string> = {
  'en-ruta': 'bg-green-50 text-green-700',
  'disponible': 'bg-gray-100 text-gray-500',
  'mantenimiento': 'bg-red-50 text-red-600',
  'cargando': 'bg-blue-50 text-blue-700',
}

const fuelColor = (fuel: number) => {
  if (fuel >= 60) return 'bg-green-500'
  if (fuel >= 35) return 'bg-amber-400'
  return 'bg-red-500'
}

interface VehicleCardProps {
  vehicle: Vehicle
}

function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium text-gray-900">{vehicle.id}</span>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[vehicle.status]}`}>
          {statusLabel[vehicle.status]}
        </span>
      </div>
      <div className="text-xs text-gray-400 mb-4">{vehicle.model} · {vehicle.year}</div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-gray-400">Conductor</span>
          <span className="font-medium text-gray-700">{vehicle.driver ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Carga</span>
          <span className="font-medium text-gray-700">{vehicle.cargo != null ? `${vehicle.cargo} t` : '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Km hoy</span>
          <span className="font-medium text-gray-700">{vehicle.kmToday} km</span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Combustible</span>
          <span className="font-medium text-gray-700">{vehicle.fuel}%</span>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${fuelColor(vehicle.fuel)}`}
            style={{ width: `${vehicle.fuel}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default function FlotaView() {
  const enRuta = vehicles.filter(v => v.status === 'en-ruta').length
  const disponibles = vehicles.filter(v => v.status === 'disponible').length
  const mantenimiento = vehicles.filter(v => v.status === 'mantenimiento').length
  const cargando = vehicles.filter(v => v.status === 'cargando').length

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'En ruta', value: enRuta, color: 'text-green-600' },
          { label: 'Disponibles', value: disponibles, color: 'text-blue-600' },
          { label: 'Cargando', value: cargando, color: 'text-amber-500' },
          { label: 'Mantenimiento', value: mantenimiento, color: 'text-red-500' },
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

      <p className="text-xs text-gray-400 text-center">
        Mostrando {vehicles.length} de 45 vehículos · Ordenado por estado
      </p>
    </div>
  )
}