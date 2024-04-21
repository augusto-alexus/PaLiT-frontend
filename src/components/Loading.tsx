export function Loading() {
    return (
        <div className='flex items-center justify-center'>
            <div className='h-fit w-fit animate-spin'>
                <i className='ri-loader-2-line text-7xl'></i>
            </div>
        </div>
    )
}

export function MainContentLoading() {
    return (
        <div className='flex h-1/2 w-full items-center justify-center'>
            <div className='h-fit w-fit animate-spin-slow'>
                <i className='ri-loader-2-line text-9xl'></i>
            </div>
        </div>
    )
}
