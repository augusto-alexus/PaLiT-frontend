import nulpBgSrc from '~/assets/lpnu-bg.jpg'

export function WithBg({ bgSrc }: { bgSrc: string }) {
    return (
        <div
            className='fixed left-0 top-0 h-full w-full bg-cover bg-no-repeat'
            style={{
                backgroundImage: `url(${bgSrc})`,
            }}
        />
    )
}

export function WithNulpBg() {
    return <WithBg bgSrc={nulpBgSrc} />
}
