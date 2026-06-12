import { Line } from 'react-chartjs-2'
import { routes, avgDeliveryTime } from '../../data/mockdata'
import type { RouteEfficiency } from '../../types'

const efficiencyBadge: Record<RouteEfficiency, string> = {
  alta: 'bg-green-50 text-green-700',
  media: 'bg-amber-50 text-amber-700',
  baja: 'bg-red-50 text-red-600',
}

const efficiencyLabel: Record<RouteEfficiency, string> = {
  alta: 'Alta',
  media: 'Media',
  baja: 'Baja',
}

const barColor = (value: number) => {
  if (value >= 90) return 'bg-green-500'
  if (value >= 75) return 'bg-amber-400'
  return 'bg-red-400'
}

export default function RutasView() {
  const lineData = {
    labels: avgDeliveryTime.labels,
    datasets: [
      {
        label: 'Horas promedio',
        data: avgDeliveryTime.data,
        borderColor: '#2563eb',
        backgroundColor: '#eff6ff',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
        pointRadius: 4,
        fill: true,
        tension: 0.3,
      },
    ],
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f3f4f6' },
        min: 5,
        max: 8,
        ticks: { stepSize: 1 },
      },
    },
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-4">Rutas más activas</div>
          <div className="space-y-0">
            {routes.map((route, i) => (
              <div
                key={route.name}
                className={`flex items-center justify-between py-3 ${i < routes.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div>
                  <div className="text-xs font-medium text-gray-800">{route.name}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{route.distance} km · {route.avgTime} h prom.</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${efficiencyBadge[route.efficiency]}`}>
                  {efficiencyLabel[route.efficiency]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm font-medium text-gray-900 mb-1">Tiempo promedio de entrega</div>
          <div className="text-xs text-gray-400 mb-4">Últimos 6 meses (horas)</div>
          <div className="h-44">
            <Line data={lineData} options={lineOptions} />
          </div>
          <div className="text-xs text-gray-400 mt-3">
            Tendencia a la baja —{' '}
            <span className="text-green-600 font-medium">mejora del 16%</span> en 6 meses
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-900">Eficiencia por corredor</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['Corredor', 'Distancia', 'Tiempo prom.', 'Puntualidad', 'Eficiencia'].map(h => (
                <th key={h} className="text-left text-[10px] font-medium text-gray-400 uppercase tracking-wider px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {routes.map((route, i) => (
              <tr key={route.name} className={i < routes.length - 1 ? 'border-b border-gray-50' : ''}>
                <td className="px-5 py-3 text-xs font-medium text-gray-800">{route.name}</td>
                <td className="px-5 py-3 text-xs text-gray-600">{route.distance} km</td>
                <td className="px-5 py-3 text-xs text-gray-600">{route.avgTime} h</td>
                <td className="px-5 py-3 text-xs text-gray-600">{route.punctuality}%</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColor(route.punctuality)}`}
                        style={{ width: `${route.punctuality}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${efficiencyBadge[route.efficiency]}`}>
                      {efficiencyLabel[route.efficiency]}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}