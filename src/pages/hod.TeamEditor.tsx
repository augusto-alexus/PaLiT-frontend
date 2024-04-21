import { useTranslation } from 'react-i18next'
import {
    Button,
    Combobox,
    GoBack,
    IComboboxOption,
    Input,
    LanguageSelect,
    MainContentLoading,
    toast,
} from '~/components'
import { useAllHoDRequests, useAllStudents, useAllTeachers, useCreateTeam, useCurrentUser, useEditTeam } from '~/hooks'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Language } from '~/models'
import { routes } from '~/pages/index.ts'

interface ITeamEdit {
    studentId: string
    teacherId: string
    theme: string
    language: Language
}

export function NewTeam() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { mutate: createNewTeam } = useCreateTeam(
        () => {
            toast(t('teamCreatedSuccessfully'))
            navigate(routes.aTeams)
        },
        (err) => alert(err)
    )
    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    return <EditTeamForm onSubmit={createNewTeam} editingExistingTeam={false} />
}

export function EditTeam() {
    const { role } = useCurrentUser()
    const { t } = useTranslation()
    const { teamId } = useParams()
    const navigate = useNavigate()
    const { mutate: editTeam } = useEditTeam(() => {
        toast(t('teamUpdatedSuccessfully'))
        navigate(routes.aTeams)
    })
    const { data: allRequests, isLoading: isLoadingRequests } = useAllHoDRequests()
    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    if (!teamId) return <Navigate to={routes.aTeams} />
    if (isLoadingRequests) return <MainContentLoading />
    const thisTeam = allRequests?.find((r) => r.id.toString() === teamId)
    if (!thisTeam) return <Navigate to={routes.aTeams} />
    return (
        <EditTeamForm
            initialState={{
                studentId: thisTeam.studentId.toString(),
                teacherId: thisTeam.teacherId.toString(),
                theme: thisTeam.theme,
                language: thisTeam.language,
            }}
            onSubmit={editTeam}
            editingExistingTeam={true}
        />
    )
}

function EditTeamForm({
    initialState,
    onSubmit,
    editingExistingTeam,
}: {
    initialState?: ITeamEdit
    onSubmit: (form: ITeamEdit) => void
    editingExistingTeam: boolean
}) {
    const { t } = useTranslation()
    const { data: requests, isInitialLoading: requestsLoading } = useAllHoDRequests()
    const { data: students, isInitialLoading: studentsLoading } = useAllStudents()
    const { data: teachers, isInitialLoading: teachersLoading } = useAllTeachers()
    const [form, setForm] = useState<ITeamEdit>(
        initialState ?? {
            studentId: '',
            teacherId: '',
            theme: '',
            language: 'UA',
        }
    )

    if (studentsLoading || teachersLoading || requestsLoading) return <MainContentLoading />

    const studentOptions = students
        ?.filter(
            (s) =>
                !!requests?.every(
                    (r) =>
                        !r.teamApproved ||
                        r.studentId !== s.studentId ||
                        (editingExistingTeam && r.studentId.toString() === initialState?.studentId)
                )
        )
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
        <div className='w-full'>
            <GoBack />
            <form
                className='mx-auto flex w-1/3 flex-col gap-4'
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(form)
                }}
            >
                <Combobox
                    options={studentOptions}
                    value={form.studentId}
                    setValue={(v) => setForm((f) => ({ ...f, studentId: v }))}
                    label={t('roles.student') + ':'}
                    placeholder={t('selectUser')}
                    disabled={editingExistingTeam}
                />
                <Combobox
                    options={teacherOptions}
                    value={form.teacherId}
                    setValue={(v) => setForm((f) => ({ ...f, teacherId: v }))}
                    label={t('roles.teacher') + ':'}
                    placeholder={t('selectUser')}
                />
                <div className='grid grid-cols-3 place-content-center gap-2'>
                    <label className='inline-flex place-items-center font-semibold'>{t('theme')}:</label>
                    <Input
                        required
                        disabled={editingExistingTeam}
                        type='text'
                        placeholder={t('selectTheme')}
                        value={form.theme}
                        onChange={(e) => setForm((f) => ({ ...f, theme: e.target.value }))}
                        className='col-span-2'
                    />
                </div>
                <div className='grid grid-cols-3 place-content-center gap-2'>
                    <label className='inline-flex place-items-center font-semibold'>{t('language')}:</label>
                    <div className='col-span-2'>
                        <LanguageSelect
                            value={form.language}
                            onChange={(e) =>
                                setForm((f) => ({
                                    ...f,
                                    language: e.target.value as Language,
                                }))
                            }
                            disabled={editingExistingTeam}
                        />
                    </div>
                </div>
                <hr className='border-cs-disabled' />
                <div className='flex flex-row place-items-center justify-end gap-4'>
                    {/* Oink */}
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/*@ts-ignore*/}
                    <Link to={-1} className='text-cs-warning'>
                        {t('cancel')}
                    </Link>
                    <Button>{t('submit')}</Button>
                </div>
            </form>
        </div>
    )
}
