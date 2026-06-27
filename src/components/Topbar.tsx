import { useAuth } from '../hooks/useAuth'

interface Props {
  title: string
}

export default function Topbar({ title }: Props) {
  const { user, logout } = useAuth()

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="h-13 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <span className="text-sm font-medium text-gray-900">{title}</span>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 capitalize">{today}</span>

        <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
          <span className="text-xs text-gray-500">{user?.name}</span>
          <button
            onClick={logout}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}