import { useTranslation } from 'react-i18next'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import {
    useAllRoles,
    useCurrentUser,
    useForm,
    useStudentCreate,
    useStudentUpdate,
    useTeacherCreate,
    useTeacherUpdate,
    useUserById,
} from '~/hooks'
import { routes } from '~/pages/index.ts'
import { Button, DisplayError, Input, MainContentLoading, Password, Select, toast } from '~/components'
import { IUserUpdateForm } from '~/models'
import { useEffect } from 'react'
import {
    IFullUserInfoDTO,
    IHodTeacherCreateDTO,
    IStudentSignUpDTO,
    IStudentUpdateDTO,
    ITeacherUpdateDTO,
} from '~/backend'

export function UserEdit() {
    const { role } = useCurrentUser()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const userId = searchParams.get('user')
    const isNewUser = userId === null
    const { data: user, isLoading: isLoadingUser, isFetching: isFetchingUser } = useUserById(userId)
    const { data: roles, isLoading: isLoadingRoles } = useAllRoles()
    const onSubmitSuccess = () => {
        if (userId) {
            toast(t('dashboard.userUpdated'))
            navigate(routes.aUser(userId))
        } else {
            toast(t('dashboard.userCreated'))
            navigate(routes.users)
        }
    }
    const { mutate: createStudent } = useStudentCreate(onSubmitSuccess)
    const { mutate: createTeacher } = useTeacherCreate(onSubmitSuccess)
    const { mutate: updateStudent } = useStudentUpdate(onSubmitSuccess)
    const { mutate: updateTeacher } = useTeacherUpdate(onSubmitSuccess)
    const studentRole = roles?.find((r) => r.name === 'student')

    const { form, setForm, onFieldChange, onSubmit } = useForm<IUserUpdateForm>(getFormStateFromUser(user), (form) => {
        if (isNewUser && form.password !== form.confirmPassword) {
            toast(`${t('passwordsNotMatching')}!`)
            return
        }

        if (studentRole?.id) {
            if (form.roleId == studentRole.id) {
                if (isNewUser) createStudent({ studentCreate: getStudentCreateDTO(form) })
                else
                    updateStudent({
                        userId,
                        studentUpdate: getStudentUpdateDTO(form),
                    })
            } else {
                if (isNewUser) createTeacher({ teacherCreate: getTeacherCreateDTO(form) })
                else
                    updateTeacher({
                        userId,
                        teacherUpdate: getTeacherUpdateDTO(form),
                    })
            }
        } else {
            toast(`Exception: student role id not found`)
        }
    })

    useEffect(() => {
        setForm(getFormStateFromUser(user))
    }, [setForm, user])

    if (role !== 'HoD') return <Navigate to={routes.aAuthRedirect} />
    if (isLoadingRoles || (isLoadingUser && isFetchingUser)) return <MainContentLoading />
    if (!roles) return <DisplayError error={Error('No roles in the system.')} />
    if (!studentRole) return <DisplayError error={Error('No "user" role in the system.')} />

    return (
        <form className='mx-auto flex flex-col gap-8' onSubmit={onSubmit}>
            <div className='grid grid-cols-2 place-content-center gap-y-3'>
                <span className='inline-flex place-items-center font-semibold'>{t('lastName')}:</span>
                <Input required name='lastName' type='text' value={form.lastName} onChange={onFieldChange} />

                <span className='inline-flex place-items-center font-semibold'>{t('firstName')}:</span>
                <Input required name='firstName' type='text' value={form.firstName} onChange={onFieldChange} />

                <span className='inline-flex place-items-center font-semibold'>{t('email')}:</span>
                <Input required name='email' type='email' value={form.email} onChange={onFieldChange} />

                {isNewUser && (
                    <>
                        <span className='inline-flex place-items-center font-semibold'>{t('password')}:</span>
                        <Password
                            required
                            autoComplete='new-password'
                            name='password'
                            value={form.password}
                            onChange={onFieldChange}
                        />

                        <span className='inline-flex place-items-center font-semibold'>{t('passwordConfirm')}:</span>
                        <Password
                            required
                            autoComplete='new-password'
                            name='confirmPassword'
                            value={form.confirmPassword}
                            onChange={onFieldChange}
                        />
                    </>
                )}

                <span className='inline-flex place-items-center font-semibold'>{t('role')}:</span>
                <Select
                    required
                    name='roleId'
                    value={form.roleId}
                    disabled={!isNewUser && form.roleId === studentRole.id}
                    onChange={onFieldChange}
                >
                    <option disabled hidden value=''>
                        {t('selectRole')}
                    </option>
                    {roles
                        .filter((r) => {
                            if (isNewUser) return r.name === 'student' || r.name === 'teacher'
                            return true
                        })
                        .map((r) => (
                            <option key={r.id} value={r.id} hidden={!isNewUser && r.id === studentRole.id}>
                                {t(`roles.${r.name}`)}
                            </option>
                        ))}
                </Select>

                <hr className='col-span-2 my-3 border-cs-neutral' />

                {form.roleId == studentRole.id && (
                    <>
                        <span className='inline-flex place-items-center font-semibold'>{t('degree')}:</span>
                        <Select required name='degree' value={form.degree} onChange={onFieldChange}>
                            <option disabled hidden value=''>
                                {t('selectYourDegree')}
                            </option>
                            <option value='BACHELOR'>{t('degrees.bachelor')}</option>
                            <option value='MASTER'>{t('degrees.master')}</option>
                        </Select>

                        <span className='inline-flex place-items-center font-semibold'>{t('faculty')}:</span>
                        <Input required name='faculty' type='text' value={form.faculty} onChange={onFieldChange} />

                        <span className='inline-flex place-items-center font-semibold'>{t('studentGroup')}:</span>
                        <Input required name='group' type='text' value={form.group} onChange={onFieldChange} />

                        <span className='inline-flex place-items-center font-semibold'>{t('graduationYear')}:</span>
                        <Input required name='gradYear' type='date' value={form.gradYear} onChange={onFieldChange} />
                    </>
                )}

                {!!form.roleId && form.roleId != studentRole.id && (
                    <>
                        <span className='inline-flex place-items-center font-semibold'>
                            {t('bachelorStudentLimit')}:
                        </span>
                        <Input
                            required
                            name='bachelorStudentLimit'
                            type='number'
                            value={form.bachelorStudentLimit}
                            onChange={onFieldChange}
                        />

                        <span className='inline-flex place-items-center font-semibold'>{t('masterStudentLimit')}:</span>
                        <Input
                            required
                            name='masterStudentLimit'
                            type='number'
                            value={form.masterStudentLimit}
                            onChange={onFieldChange}
                        />
                    </>
                )}
            </div>
            <div className='flex flex-row place-items-center justify-end gap-4'>
                <Link to={isNewUser ? routes.aUsers : routes.aUser(userId)} className='text-cs-warning'>
                    {t('cancel')}
                </Link>
                <Button>{t('submit')}</Button>
            </div>
        </form>
    )
}

function getFormStateFromUser(user: IFullUserInfoDTO | undefined): IUserUpdateForm {
    return {
        lastName: user?.lastName || '',
        firstName: user?.firstName || '',
        email: user?.email || '',
        password: '',
        confirmPassword: '',
        roleId: user?.roleDTO?.id || '',
        degree: user?.studentDTO?.degree || '',
        group: user?.studentDTO?.cluster || '',
        faculty: user?.studentDTO?.faculty || '',
        gradYear: user?.studentDTO?.graduateDate || '',
        bachelorStudentLimit: user?.teacherDTO?.generalBachelor || 0,
        masterStudentLimit: user?.teacherDTO?.generalMaster || 0,
    }
}

function getTeacherCreateDTO(form: IUserUpdateForm): IHodTeacherCreateDTO {
    return {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        password: form.password,
        generalBachelor: form.bachelorStudentLimit,
        generalMaster: form.masterStudentLimit,
    }
}

function getStudentCreateDTO(form: IUserUpdateForm): IStudentSignUpDTO {
    return {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        password: form.password,
        faculty: form.faculty,
        cluster: form.group,
        degree: form.degree,
        graduateDate: form.gradYear,
    }
}

function getStudentUpdateDTO(form: IUserUpdateForm): IStudentUpdateDTO {
    return {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        roleId: form.roleId,
        faculty: form.faculty,
        cluster: form.group,
        degree: form.degree,
        graduateDate: form.gradYear,
    }
}

function getTeacherUpdateDTO(form: IUserUpdateForm): ITeacherUpdateDTO {
    return {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        roleId: form.roleId,
        generalBachelor: form.bachelorStudentLimit,
        generalMaster: form.masterStudentLimit,
    }
}
