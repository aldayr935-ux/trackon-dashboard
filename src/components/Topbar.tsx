interface Props {
  title: string
}

export default function Topbar({ title }: Props) {
  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <header className="h-13 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <span className="text-sm font-medium text-gray-900">{title}</span>
      <span className="text-xs text-gray-400 capitalize">{today}</span>
    </header>
  )
}