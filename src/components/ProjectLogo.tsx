import logoMinifiedSvg from '~/assets/logo-min.svg'
import logoSvg from '~/assets/logo.svg'
import { useWindowSize } from '~/hooks/useWindowSize.ts'

export function ProjectLogo({ className }: { className?: string }) {
    const { width } = useWindowSize()
    const renderMinifiedLogo = width < 768
    const classes = ['w-fit md:scale-125 lg:scale-150']
    if (className) classes.push(className)
    return (
        <img
            src={renderMinifiedLogo ? logoMinifiedSvg : logoSvg}
            alt='Thesis Tracker logo'
            className={classes.join(' ')}
        />
    )
}
