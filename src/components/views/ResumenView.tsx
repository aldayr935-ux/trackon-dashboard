import { useEffect, useState } from 'react'
import { Bar, Doughnut } from 'react-chartjs-2'
import { dashboardService } from '../../services/api'

interface VehicleByStatus { status: string; count: number }
interface ShipmentByStatus { status: string; count: number }
interface RecentShipment {
  id: string
  trackingCode: string
  origin: string
  destination: string
  status: string
  vehicle: { plate: string } | null
}
interface DashboardStats {
  shipments: { total: number; byStatus: ShipmentByStatus[] }
  vehicles: { total: number; byStatus: VehicleByStatus[] }
  routes: { active: number }
  alerts: { unread: number }
  recentShipments: RecentShipment[]
}

const shipmentStatusLabel: Record<string, string> = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En ruta',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
}
const shipmentStatusBadge: Record<string, string> = {
  PENDING: 'bg-blue-50 text-blue-700',
  IN_TRANSIT: 'bg-green-50 text-green-700',
  DELIVERED: 'bg-gray-100 text-gray-500',
  CANCELLED: 'bg-red-50 text-red-700',
}

const getCount = (list: { status: string; count: number }[], status: string) =>
  list.find(v => v.status === status)?.count ?? 0

export default function ResumenView() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    dashboardService.getStats()
      .then(setStats)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-sm text-gray-400">
      Cargando estadísticas...
    </div>
  )

  if (error || !stats) return (
    <div className="flex items-center justify-center h-64 text-sm text-red-500">
      Error al cargar datos: {error}
    </div>
  )

  const enRuta = getCount(stats.vehicles.byStatus, 'IN_ROUTE')
  const disponibles = getCount(stats.vehicles.byStatus, 'AVAILABLE')
  const mantenimiento = getCount(stats.vehicles.byStatus, 'MAINTENANCE')

  const kpis = [
    { label: 'Vehículos activos', value: stats.vehicles.total, sub: `${enRuta} en ruta`, trend: 'up' },
    { label: 'Envíos en ruta', value: getCount(stats.shipments.byStatus, 'IN_TRANSIT'), sub: 'en tránsito', trend: 'up' },
    { label: 'Entregas totales', value: getCount(stats.shipments.byStatus, 'DELIVERED'), sub: 'completadas', trend: 'up' },
    { label: 'Alertas activas', value: stats.alerts.unread, sub: 'sin leer', trend: stats.alerts.unread > 0 ? 'down' : 'up' },
  ]

const weekLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const barData = {
  labels: weekLabels,
  datasets: [{
    label: 'Entregas',
    data: weekLabels.map(() => 0),
    backgroundColor: weekLabels.map((_: string, i: number) =>
      i === weekLabels.length - 1 ? '#2563eb' : '#bfdbfe'
    ),
    borderRadius: 4,
  }],
}

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: '#f3f4f6' }, ticks: { stepSize: 30 } },
    },
  }

  const doughnutData = {
    labels: ['En ruta', 'Disponibles', 'Mantenimiento'],
    datasets: [{
      data: [enRuta, disponibles, mantenimiento],
      backgroundColor: ['#16a34a', '#2563eb', '#dc2626'],
      borderWidth: 0,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '70%',
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-3">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-xs text-gray-400 mb-1">{kpi.label}</div>
            <div className="text-2xl font-medium text-gray-900">{kpi.value}</div>
            <div className={`text-xs mt-1 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {kpi.trend === 'up' ? '↑' : '↓'} {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-4">Entregas por día — esta semana</div>
          <div className="h-40">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-400">
            <span>Semana actual</span>
            <span className="text-gray-700 font-medium">Total: {stats.shipments.total} envíos</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-4">Estado de la flota</div>
          <div className="flex items-center gap-6">
            <div className="h-36 w-36 flex-shrink-0">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
            <div className="space-y-2 flex-1">
              {[
                { label: 'En ruta', value: enRuta, color: 'bg-green-600' },
                { label: 'Disponibles', value: disponibles, color: 'bg-blue-600' },
                { label: 'Mantenimiento', value: mantenimiento, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                    <span className="text-gray-500">{item.label}</span>
                  </div>
                  <span className="font-medium text-gray-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">Envíos recientes</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              {['Código', 'Ruta', 'Vehículo', 'Estado'].map(h => (
                <th key={h} className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.recentShipments.map((s, i) => (
              <tr key={s.id} className={i < stats.recentShipments.length - 1 ? 'border-b border-gray-50' : ''}>
                <td className="px-5 py-3 font-mono text-gray-500">{s.trackingCode}</td>
                <td className="px-5 py-3 text-gray-700">{s.origin} → {s.destination}</td>
                <td className="px-5 py-3 text-gray-600">{s.vehicle?.plate ?? '—'}</td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${shipmentStatusBadge[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {shipmentStatusLabel[s.status] ?? s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}