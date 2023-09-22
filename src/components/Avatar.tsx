import { useCurrentUser } from '~/hooks/useCurrentUser.ts'

export function Avatar() {
    const currentUser = useCurrentUser()
    const bgColor =
        currentUser.role === 'teacher' ? 'bg-cs-primary' : 'bg-cs-secondary'
    return (
        <div className='flex flex-row place-content-center place-items-center gap-2'>
            <div className={`relative h-10 w-10 rounded-[100%] ${bgColor} p-4`}>
                <span className='text-md absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 align-middle font-semibold text-white'>
                    {currentUser.lastName.charAt(0)}
                    {currentUser.firstName.charAt(0)}
                </span>
            </div>
            <div>
                <button className='bg-transparent p-0 outline-none hover:outline-none'>
                    <i className='ri-more-fill text-cs-text-dark'></i>
                </button>
            </div>
        </div>
    )
}
