import { useLayoutEffect, useState } from 'react'
import logoMinifiedSvg from '../assets/logo-min.svg'
import logoSvg from '../assets/logo.svg'

function useWindowSize() {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight])
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight])
        }

        window.addEventListener('resize', updateSize)
        updateSize()
        return () => window.removeEventListener('resize', updateSize)
    }, [])
    return { width: size[0], height: size[1] }
}

export function ProjectLogo({ className = '' }: { className?: string }) {
    const { width } = useWindowSize()
    const renderMinifiedLogo = width < 768
    return (
        <img
            src={renderMinifiedLogo ? logoMinifiedSvg : logoSvg}
            alt='Thesis Tracker logo'
            className={`w-fit md:scale-125 lg:scale-150 ${className}`}
        />
    )
}
