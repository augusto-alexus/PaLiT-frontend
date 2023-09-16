import logoSvg from '../assets/logo.svg'

export function Logo() {
    return (
        <img
            src={logoSvg}
            alt='Thesis Tracker logo'
            className='w-fit md:scale-125 lg:scale-150'
        />
    )
}
