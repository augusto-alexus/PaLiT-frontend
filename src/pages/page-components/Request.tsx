import { IRequest } from '~/backend'
import { Button } from '~/components'
import { useCurrentUser } from '~/hooks'
import { getHumanReadableDuration } from '~/lib'

export function Request({
    request,
    onReject,
    onApprove,
}: {
    request: IRequest
    onReject: (requestId: number) => void
    onApprove: (requestId: number) => void
}) {
    const currentUser = useCurrentUser()
    const canAccept =
        (request.direction == 'STUDENT' && currentUser.role == 'student') ||
        (request.direction == 'TEACHER' && currentUser.role == 'teacher')
    return (
        <div
            className={`grid grid-cols-3 gap-4 rounded-xl border-b p-2 px-6 pb-4 ${
                request.approved ? 'bg-green-300' : ''
            }`}
        >
            <div className='col-span-2 text-xl font-bold'>
                {request.user.lastName} {request.user.firstName}
            </div>
            <div className='place-self-end font-mono text-sm'>
                {getHumanReadableDuration(new Date(request.createdDate))}
            </div>
            {request.user.degree && (
                <div className='col-span-2 font-semibold'>
                    {request.user.degree}
                </div>
            )}
            {request.user.faculty && (
                <div className='place-self-end font-mono text-sm'>
                    {request.user.faculty}
                </div>
            )}
            <div className='col-span-2'>
                Запропонована тема:{' '}
                <span className='font-bold'>{request.theme}</span>
            </div>
            {request.user.cluster && (
                <div className='place-self-end font-mono text-sm'>
                    {request.user.cluster}
                </div>
            )}
            <div className='col-span-3 flex flex-row justify-between'>
                <Button
                    preset='text'
                    className='text-cs-warning'
                    onClick={() => onReject(request.requestId)}
                >
                    Відхилити запит
                </Button>
                <Button
                    preset='text'
                    hidden={!canAccept}
                    onClick={() => onApprove(request.requestId)}
                >
                    Прийняти запит
                </Button>
            </div>
        </div>
    )
}
