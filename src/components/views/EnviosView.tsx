import { useEffect, useState } from 'react'
import { shipmentsService } from '../../services/api'

interface ApiShipment {
  id: string
  trackingCode: string
  origin: string
  destination: string
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'
  weight: number
  vehicle: { plate: string } | null
  route: { name: string } | null
}

const statusLabel: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En ruta',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}
const statusBadge: Record<string, string> = {
  PENDING: 'bg-blue-50 text-blue-700',
  IN_TRANSIT: 'bg-green-50 text-green-700',
  DELIVERED: 'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-50 text-red-600',
}

type Filter = 'TODOS' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED'

const filters: { id: Filter; label: string }[] = [
  { id: 'TODOS', label: 'Todos' },
  { id: 'IN_TRANSIT', label: 'En ruta' },
  { id: 'PENDING', label: 'Pendientes' },
  { id: 'DELIVERED', label: 'Entregados' },
  { id: 'CANCELLED', label: 'Cancelados' },
]

function ShipmentRow({ shipment: s, isLast }: { shipment: ApiShipment; isLast: boolean }) {
  return (
    <tr className={!isLast ? 'border-b border-gray-50' : ''}>
      <td className="px-5 py-3 font-mono text-xs text-gray-400">{s.trackingCode}</td>
      <td className="px-3 py-3 text-xs text-gray-700">{s.origin}</td>
      <td className="px-3 py-3 text-xs text-gray-700">{s.destination}</td>
      <td className="px-3 py-3 text-xs text-gray-400 font-mono">{s.vehicle?.plate ?? '—'}</td>
      <td className="px-3 py-3 text-xs text-gray-600">{s.weight} kg</td>
      <td className="px-3 py-3 text-xs text-gray-600">{s.route?.name ?? '—'}</td>
      <td className="px-3 py-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
          {statusLabel[s.status]}
        </span>
      </td>
    </tr>
  )
}

export default function EnviosView() {
  const [shipments, setShipments] = useState<ApiShipment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<Filter>('TODOS')

  useEffect(() => {
    shipmentsService.getAll()
      .then(setShipments)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">Cargando envíos...</div>
  )
  if (error) return (
    <div className="flex items-center justify-center h-64 text-sm text-red-500">Error: {error}</div>
  )

  const filtered = activeFilter === 'TODOS'
    ? shipments
    : shipments.filter(s => s.status === activeFilter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map(f => {
          const count = f.id === 'TODOS'
            ? shipments.length
            : shipments.filter(s => s.status === f.id).length
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors cursor-pointer
                ${activeFilter === f.id
                  ? 'bg-gray-100 text-gray-900 border-gray-300 font-medium'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
            >
              {f.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Código', 'Origen', 'Destino', 'Vehículo', 'Peso', 'Ruta', 'Estado'].map(h => (
                <th key={h} className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-3 first:px-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0
              ? filtered.map((s, i) => (
                  <ShipmentRow key={s.id} shipment={s} isLast={i === filtered.length - 1} />
                ))
              : (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                    No hay envíos con este estado
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}