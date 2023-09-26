import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
    approveRequest,
    getMyStudents,
    IRequest,
    rejectRequest,
    useGetRequestsStudent,
    useGetRequestsTeacher,
} from '~/backend'
import { Button, toast } from '~/components'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'
import { getHumanReadableDuration } from '~/lib/date.ts'

export function Dashboard() {
    const currentUser = useCurrentUser()
    const accessToken = useAccessToken()
    const queryClient = useQueryClient()
    const { data: students } = useQuery({
        enabled: currentUser.role === 'teacher',
        queryKey: ['myStudents'],
        queryFn: () => getMyStudents(accessToken),
    })
    console.log(students)
    const { mutate: mutateReject } = useMutation({
        mutationFn: async ({ requestId }: { requestId: number }) => {
            return rejectRequest({ accessToken, requestId })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            toast('Запрошення відхилено!')
        },
    })
    const { mutate: mutateApprove } = useMutation({
        mutationFn: async ({ requestId }: { requestId: number }) => {
            return approveRequest({ accessToken, requestId })
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            await queryClient.invalidateQueries(['myProject'])
            toast('Запрошення прийнято!')
        },
    })

    const getRequestsStudent = useGetRequestsStudent(accessToken)
    const getRequestsTeacher = useGetRequestsTeacher(accessToken)
    const { data } = useQuery(['requests'], () => {
        if (currentUser.role === 'teacher') return getRequestsTeacher()
        else return getRequestsStudent()
    })

    return (
        <div className='mx-auto flex max-w-lg flex-col gap-20'>
            {!data?.length && (
                <h2 className='text-center text-2xl'>Запрошення відсутні</h2>
            )}
            {data?.map((request) => (
                <Request
                    key={request.requestId}
                    request={request}
                    onReject={(requestId) => mutateReject({ requestId })}
                    onApprove={(requestId) => mutateApprove({ requestId })}
                />
            ))}
        </div>
    )
}

function Request({
    request,
    onReject,
    onApprove,
}: {
    request: IRequest
    onReject: (requestId: number) => void
    onApprove: (requestId: number) => void
}) {
    const currentUser = useCurrentUser()
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
                    hidden={
                        (request.direction == 'STUDENT' &&
                            currentUser.role == 'teacher') ||
                        (request.direction == 'TEACHER' &&
                            currentUser.role == 'student')
                    }
                    onClick={() => onApprove(request.requestId)}
                >
                    Прийняти запит
                </Button>
            </div>
        </div>
    )
}
