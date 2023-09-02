import logoSvg from '../assets/logo.svg'

export function Logo() {
    return (
        <img
            src={logoSvg}
            alt='Thesis Tracker logo'
            className='w-fit dark:invert md:scale-125 lg:scale-150'
        />
    )
}
