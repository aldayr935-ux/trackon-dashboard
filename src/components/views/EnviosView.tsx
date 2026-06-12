import { useState } from 'react'
import { shipments } from '../../data/mockdata'
import type { Shipment, ShipmentStatus } from '../../types'

const statusLabel: Record<ShipmentStatus, string> = {
  'en-ruta': 'En ruta',
  'demorado': 'Demorado',
  'cargando': 'Cargando',
  'entregado': 'Entregado',
}

const statusBadge: Record<ShipmentStatus, string> = {
  'en-ruta': 'bg-green-50 text-green-700',
  'demorado': 'bg-amber-50 text-amber-700',
  'cargando': 'bg-blue-50 text-blue-700',
  'entregado': 'bg-gray-100 text-gray-500',
}

type Filter = 'todos' | ShipmentStatus

const filters: { id: Filter; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'en-ruta', label: 'En ruta' },
  { id: 'demorado', label: 'Demorados' },
  { id: 'cargando', label: 'Cargando' },
  { id: 'entregado', label: 'Entregados' },
]

interface RowProps {
  shipment: Shipment
  isLast: boolean
}

function ShipmentRow({ shipment: s, isLast }: RowProps) {
  return (
    <tr className={!isLast ? 'border-b border-gray-50' : ''}>
      <td className="px-5 py-3 font-mono text-xs text-gray-400">{s.id}</td>
      <td className="px-3 py-3 text-xs text-gray-700">{s.origin}</td>
      <td className="px-3 py-3 text-xs text-gray-700">{s.destination}</td>
      <td className="px-3 py-3 text-xs text-gray-600">{s.driver}</td>
      <td className="px-3 py-3 text-xs text-gray-400 font-mono">{s.vehicleId}</td>
      <td className="px-3 py-3 text-xs text-gray-600">{s.cargo != null ? `${s.cargo} t` : '—'}</td>
      <td className="px-3 py-3">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[s.status]}`}>
          {statusLabel[s.status]}
        </span>
      </td>
      <td className="px-3 py-3 text-xs text-gray-600">{s.eta}</td>
    </tr>
  )
}

export default function EnviosView() {
  const [activeFilter, setActiveFilter] = useState<Filter>('todos')

  const filtered = activeFilter === 'todos'
    ? shipments
    : shipments.filter(s => s.status === activeFilter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {filters.map(f => {
          const count = f.id === 'todos'
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
              {['ID', 'Origen', 'Destino', 'Conductor', 'Vehículo', 'Carga', 'Estado', 'ETA'].map(h => (
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
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-gray-400">
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