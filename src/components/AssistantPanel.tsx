import { useState, useRef, useEffect } from 'react'
import type { ChatMessage } from '../types'
import { vehicles, shipments, routes, alerts } from '../data/mockdata'

const SYSTEM_PROMPT = `Eres el asistente de operaciones de TRACKON, una empresa de logística y carga. 
Respondes preguntas sobre la flota, envíos, rutas y alertas del sistema.
Sé conciso y directo. Usa datos concretos cuando los tengas disponibles.

FLOTA:
${vehicles.map(v => `- ${v.id} (${v.model} ${v.year}): ${v.status}, conductor: ${v.driver ?? 'sin asignar'}, combustible: ${v.fuel}%, km hoy: ${v.kmToday}`).join('\n')}

ENVÍOS ACTIVOS:
${shipments.map(s => `- ${s.id}: ${s.origin} → ${s.destination}, conductor: ${s.driver}, estado: ${s.status}, ETA: ${s.eta}`).join('\n')}

RUTAS:
${routes.map(r => `- ${r.name}: ${r.distance}km, tiempo promedio ${r.avgTime}h, puntualidad ${r.punctuality}%`).join('\n')}

ALERTAS ACTIVAS:
${alerts.map(a => `- [${a.severity}] ${a.message} (${a.time})`).join('\n')}
`

const suggestions = [
  '¿Qué envíos están demorados?',
  '¿Qué vehículos necesitan combustible?',
  '¿Cuál es la ruta más eficiente?',
  '¿Qué alertas son críticas?',
]

interface Props {
  onClose: () => void
}

export default function AssistantPanel({ onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return

    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

    const userMessage: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    if (import.meta.env.PROD) {
  const reply = 'El asistente IA está disponible solo en entorno local. Consulta el README para configurarlo.'
  setMessages(prev => [...prev, { role: 'assistant', content: reply }])
  setLoading(false)
  return
}

    try {
      const response = await fetch('http://localhost:8010/proxy/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true',
  },
  body: JSON.stringify({
    model: 'claude-sonnet-4-6',
    max_tokens: 1000,
    system: SYSTEM_PROMPT,
    messages: updatedMessages,
  }),
})

      const data = await response.json()

      const reply = data.content?.[0]?.text ?? 'No pude obtener una respuesta.'
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Hubo un error al conectar con el asistente. Intenta de nuevo.',
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white border border-gray-200 rounded-2xl shadow-lg flex flex-col overflow-hidden z-50" style={{ height: '520px' }}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-medium">T</div>
          <div>
            <div className="text-xs font-medium text-gray-900">Asistente TRACKON</div>
            <div className="text-[10px] text-green-500">En línea</div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none cursor-pointer">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 text-center pt-2">Pregúntame sobre la operación actual</p>
            <div className="space-y-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-xl rounded-bl-sm px-4 py-2.5">
              <div className="flex gap-1 items-center h-3">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Escribe tu pregunta..."
            disabled={loading}
            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 focus:bg-white transition-colors disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}