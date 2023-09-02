import nulpBgSrc from '../assets/lpnu-bg.jpg'

export function WithBg({ bgSrc, alt }: { bgSrc: string; alt?: string }) {
    return (
        <img
            className='fixed left-0 top-0 h-full w-full bg-contain dark:opacity-5'
            src={bgSrc}
            alt={alt}
        />
    )
}

export function WithNulpBg() {
    return <WithBg bgSrc={nulpBgSrc} alt={'NULP background scenery'} />
}
