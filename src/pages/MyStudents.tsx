import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { getMyStudents, IMyStudent } from '~/backend'
import { useAccessToken, useCurrentUser } from '~/hooks'
import { routes } from '~/pages/routes.ts'

export function MyStudents() {
    const { role } = useCurrentUser()
    const accessToken = useAccessToken()
    const { data } = useQuery({
        enabled: role === 'teacher',
        queryKey: ['myStudents'],
        queryFn: () => getMyStudents(accessToken),
    })
    if (role !== 'teacher') return <Navigate to={`/${routes.authRedirect}`} />
    const anyStudents = !!data?.length
    if (!anyStudents)
        return (
            <div className='flex w-full flex-col gap-8'>
                <div className='text-center text-2xl font-semibold text-cs-text-dark'>
                    Ви ще не розпочали свою роботу
                </div>
                <div className='mx-auto max-w-md text-center text-xl text-cs-text-dark'>
                    <Link to={`/${routes.teacherList}`}>Запросіть</Link>{' '}
                    студента або{' '}
                    <Link to={`/${routes.invitations}`}>прийміть</Link>{' '}
                    запрошення від студента щоб розпочати перевіряти
                    кваліфікаційні роботи
                </div>
            </div>
        )

    return (
        <div className='flex w-full flex-col gap-12'>
            <h2 className='text-center text-2xl font-semibold'>
                Ваші студенти
            </h2>
            <div className='flex flex-col place-items-center gap-8'>
                {data.map((myStudent) => (
                    <MyStudentInfoRow
                        key={myStudent.student.studentId}
                        myStudent={myStudent}
                    />
                ))}
            </div>
        </div>
    )
}

function MyStudentInfoRow({ myStudent }: { myStudent: IMyStudent }) {
    const navigate = useNavigate()
    const { student } = myStudent
    return (
        <div
            onClick={() => navigate(`/${routes.myStudent(student.studentId)}`)}
            className='flex w-full max-w-sm flex-col rounded-t-3xl border-b border-b-cs-additional-gray p-4 pb-4 hover:cursor-pointer hover:bg-cs-bg-neutral'
        >
            <div className='my-1 grid grid-cols-5 gap-2'>
                <div className='col-span-3 text-lg font-semibold'>
                    {student.lastName} {student.firstName}
                </div>
                <div className='col-span-2 place-self-end font-mono text-cs-text-neutral'>
                    {student.faculty}
                </div>
                <div className='col-span-3'>{student.degree}</div>
                <div className='col-span-2 place-self-end font-mono text-cs-text-neutral'>
                    {student.cluster}
                </div>
                <div className='col-span-5 text-xl'>
                    <span className='font-mono'>Тема</span>:{' '}
                    <span className='font-semibold'>«{myStudent.theme}»</span>
                </div>
                <div className='text-md col-span-3'>
                    <span className='font-mono'>Мова</span>:{' '}
                    <span className='font-semibold'>{myStudent.language}</span>
                </div>
            </div>
        </div>
    )
}
