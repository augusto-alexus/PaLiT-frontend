export function Avatar({
    firstName,
    lastName,
    bgColor,
    small,
    big,
}: {
    firstName: string
    lastName: string
    bgColor: string
    small?: boolean
    big?: boolean
}) {
    return (
        <div
            title={lastName + ' ' + firstName}
            className='flex select-none flex-row place-content-center place-items-center gap-2'
        >
            <div
                className={`relative ${
                    small ? 'h-4 w-4 text-sm' : !big ? 'text-md h-10 w-10' : 'h-12 w-12 text-lg'
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
