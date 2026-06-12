import type { ViewId } from '../types'

interface NavItem {
  id: ViewId
  label: string
  badge?: number
}

const navItems: NavItem[] = [
  { id: 'resumen', label: 'Resumen general' },
  { id: 'flota', label: 'Flota de vehículos' },
  { id: 'envios', label: 'Envíos activos', badge: 18 },
  { id: 'rutas', label: 'Rutas y tiempos' },
  { id: 'alertas', label: 'Alertas del sistema', badge: 4 },
]

interface Props {
  activeView: ViewId
  onNavigate: (view: ViewId) => void
}

export default function Sidebar({ activeView, onNavigate }: Props) {
  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="text-base font-medium tracking-widest text-gray-900">⬡ TRACKON</div>
        <div className="text-xs text-gray-400 mt-0.5">Panel de operaciones</div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mb-2">
          Principal
        </p>
        {navItems.slice(0, 4).map(item => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}

        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-2 mt-4 mb-2">
          Sistema
        </p>
        {navItems.slice(4).map(item => (
          <NavButton
            key={item.id}
            item={item}
            isActive={activeView === item.id}
            onClick={() => onNavigate(item.id)}
          />
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
            LM
          </div>
          <div>
            <div className="text-xs font-medium text-gray-900">Luis Morales</div>
            <div className="text-[11px] text-gray-400">Supervisor de operaciones</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

interface NavButtonProps {
  item: NavItem
  isActive: boolean
  onClick: () => void
}

function NavButton({ item, isActive, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors cursor-pointer
        ${isActive
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`} />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span className="text-[10px] bg-blue-50 text-blue-600 font-medium px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </button>
  )
}