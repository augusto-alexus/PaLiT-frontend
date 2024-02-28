import { useTranslation } from 'react-i18next'
import { Button, GoBack, Input, Loading } from '~/components'
import { useAllHoDRequests, useAllStudents, useAllTeachers } from '~/hooks'
import { Combobox, IComboboxOption } from '~/components/Combobox.tsx'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { routes } from '~/pages'

export function HodNewTeam() {
    const { t } = useTranslation()
    const { data: requests, isInitialLoading: requestsLoading } = useAllHoDRequests()
    const { data: students, isInitialLoading: studentsLoading } = useAllStudents()
    const { data: teachers, isInitialLoading: teachersLoading } = useAllTeachers()
    const [studentId, setStudentId] = useState<string>('')
    const [teacherId, setTeacherId] = useState<string>('')
    const [theme, setTheme] = useState<string>('')

    if (studentsLoading || teachersLoading || requestsLoading) return <Loading />

    const studentOptions = students
        ?.filter((s) => !!requests?.every((r) => r.studentId !== s.studentId))
        ?.map(
            (s) =>
                ({
                    id: s.studentId.toString(),
                    label: s.lastName + ', ' + s.firstName,
                } as IComboboxOption)
        )

    const teacherOptions = teachers?.map(
        (t) =>
            ({
                id: t.teacherId.toString(),
                label: t.lastName + ', ' + t.firstName,
            } as IComboboxOption)
    )

    return (
        <main className='w-full'>
            <GoBack />
            <form
                className='mx-auto flex w-1/3 flex-col gap-4'
                onSubmit={(e) => {
                    e.preventDefault()
                    alert(JSON.stringify({ studentId, teacherId, theme }))
                }}
            >
                <Combobox
                    options={studentOptions}
                    value={studentId}
                    setValue={(v) => setStudentId(v)}
                    label={t('roles.student') + ':'}
                    placeholder={t('selectUser')}
                />
                <Combobox
                    options={teacherOptions}
                    value={teacherId}
                    setValue={(v) => setTeacherId(v)}
                    label={t('roles.teacher') + ':'}
                    placeholder={t('selectUser')}
                />
                <div className='grid grid-cols-3 place-content-center gap-2'>
                    <label className='inline-flex place-items-center font-semibold'>{t('theme')}:</label>
                    <Input
                        required
                        type='text'
                        placeholder={t('selectTheme')}
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className='col-span-2'
                    />
                </div>
                <hr className='border-cs-disabled' />
                <div className='flex flex-row place-items-center justify-end gap-4'>
                    <Link to={-1} className='text-cs-warning'>
                        {t('cancel')}
                    </Link>
                    <Button>{t('submit')}</Button>
                </div>
            </form>
        </main>
    )
}
