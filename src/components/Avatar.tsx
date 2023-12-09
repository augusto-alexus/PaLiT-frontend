import { useCurrentUser } from '~/hooks'
import { Role } from '~/models'

export function Avatar({
    user,
    small,
}: {
    user?: { role: Role; firstName: string; lastName: string }
    small?: boolean
}) {
    const currentUser = useCurrentUser()
    const role = user?.role ?? currentUser.role
    const firstName = user?.firstName ?? currentUser.firstName
    const lastName = user?.lastName ?? currentUser.lastName
    const bgColor = role === 'teacher' ? 'bg-cs-primary' : 'bg-cs-secondary'
    return (
        <div
            title={lastName + ' ' + firstName}
            className='flex select-none flex-row place-content-center place-items-center gap-2'
        >
            <div
                className={`relative ${
                    small ? 'h-4 w-4 text-sm' : 'text-md h-10 w-10'
                } rounded-[100%] ${bgColor} p-4`}
            >
                <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 align-middle font-semibold text-white'>
                    {lastName.charAt(0)}
                    {firstName.charAt(0)}
                </span>
            </div>
        </div>
    )
}
