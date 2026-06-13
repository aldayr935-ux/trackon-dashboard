// src/components/OrientationGuard.tsx
import { useState, useEffect } from 'react'

export default function OrientationGuard({ children }: { children: React.ReactNode }) {
    const [isPortrait, setIsPortrait] = useState(false)

    useEffect(() => {
        const check = () => {
            setIsPortrait(window.innerWidth < 768 && window.innerHeight > window.innerWidth)
        }
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    if (isPortrait) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center text-center px-8 z-50">
                <div className="text-5xl mb-6">⟳</div>
                <h1 className="text-white text-lg font-medium mb-2">Gira tu dispositivo</h1>
                <p className="text-gray-400 text-sm leading-relaxed">
                    TRACKON está optimizado para pantallas horizontales. Rota tu dispositivo para continuar.
                </p>
            </div>
        )
    }

    return <>{children}</>
}