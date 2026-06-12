import { Bar, Doughnut } from 'react-chartjs-2'
import { shipments, deliveriesPerDay, vehicles } from '../../data/mockdata'
import type { ShipmentStatus } from '../../types'

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

const kpis = [
  { label: 'Vehículos activos', value: 34, sub: '+2 vs ayer', trend: 'up' },
  { label: 'Envíos en ruta', value: 18, sub: '94% a tiempo', trend: 'up' },
  { label: 'Entregas hoy', value: 127, sub: '+9% vs lunes', trend: 'up' },
  { label: 'Incidencias', value: 4, sub: '2 críticas', trend: 'down' },
]

export default function ResumenView() {
  const enRuta = vehicles.filter(v => v.status === 'en-ruta').length
  const disponibles = vehicles.filter(v => v.status === 'disponible').length
  const mantenimiento = vehicles.filter(v => v.status === 'mantenimiento').length
  const cargando = vehicles.filter(v => v.status === 'cargando').length

  const barData = {
    labels: deliveriesPerDay.labels,
    datasets: [
      {
        label: 'Entregas',
        data: deliveriesPerDay.data,
        backgroundColor: deliveriesPerDay.labels.map((_, i) =>
          i === deliveriesPerDay.labels.length - 1 ? '#2563eb' : '#bfdbfe'
        ),
        borderRadius: 4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f3f4f6' },
        ticks: { stepSize: 30 },
      },
    },
  }

  const doughnutData = {
    labels: ['En ruta', 'Disponibles', 'Cargando', 'Mantenimiento'],
    datasets: [
      {
        data: [enRuta, disponibles, cargando, mantenimiento],
        backgroundColor: ['#16a34a', '#2563eb', '#d97706', '#dc2626'],
        borderWidth: 0,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    cutout: '70%',
  }

  return (
    <div className="space-y-5">

      {/* KPIs */}
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

      {/* Gráficas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-4">Entregas por día — esta semana</div>
          <div className="h-40">
            <Bar data={barData} options={barOptions} />
          </div>
          <div className="flex justify-between mt-3 text-xs text-gray-400">
            <span>Semana 24</span>
            <span className="text-gray-700 font-medium">Total: 607 entregas</span>
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
                { label: 'Cargando', value: cargando, color: 'bg-amber-500' },
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

      {/* Tabla de envíos recientes */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">Envíos recientes</span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-5 py-3">ID</th>
              <th className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-3">Ruta</th>
              <th className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-3">Conductor</th>
              <th className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-3">Estado</th>
              <th className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-3 py-3">ETA</th>
            </tr>
          </thead>
          <tbody>
            {shipments.slice(0, 5).map((s, i) => (
              <tr key={s.id} className={i < 4 ? 'border-b border-gray-50' : ''}>
                <td className="px-5 py-3 font-mono text-gray-500">{s.id}</td>
                <td className="px-3 py-3 text-gray-700">{s.origin} → {s.destination}</td>
                <td className="px-3 py-3 text-gray-600">{s.driver}</td>
                <td className="px-3 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge[s.status]}`}>
                    {statusLabel[s.status]}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-600">{s.eta}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}