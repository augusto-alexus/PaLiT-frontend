import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
    useAllRoles,
    useForm,
    useStudentCreate,
    useStudentUpdate,
    useTeacherCreate,
    useTeacherUpdate,
    useUserById,
} from '~/hooks'
import { routes } from '~/pages'
import { Button, DisplayError, Input, Loading, Password, Select, toast } from '~/components'
import { IUserUpdateForm } from '~/models'
import { useEffect } from 'react'
import { IFullUserInfoDTO, IStudentSignUpDTO, IStudentUpdateDTO, ITeacherSignUpDTO, ITeacherUpdateDTO } from '~/backend'

export function HodUserEdit() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [searchParams] = useSearchParams()
    const userId = searchParams.get('user')
    const isNewUser = userId === null
    const { user, isLoading: isLoadingUser, isFetching: isFetchingUser, error: userError } = useUserById(userId)
    const { data: roles, isLoading: isLoadingRoles, error: rolesError } = useAllRoles()
    const onSubmitSuccess = () => {
        toast(t('dashboard.userUpdated'))
        navigate(routes.hod.users.aUser(userId!))
    }
    const { mutate: createStudent } = useStudentCreate(onSubmitSuccess)
    const { mutate: createTeacher } = useTeacherCreate(onSubmitSuccess)
    const { mutate: updateStudent } = useStudentUpdate(onSubmitSuccess)
    const { mutate: updateTeacher } = useTeacherUpdate(onSubmitSuccess)

    const studentRole = roles?.find(r => r.name === 'student')
    const teacherRole = roles?.find(r => r.name === 'teacher')

    const { form, setForm, onFieldChange, onSubmit } =
        useForm<IUserUpdateForm>(
            getFormStateFromUser(user),
            (form) => {
                if (isNewUser && form.password !== form.confirmPassword) {
                    toast(`${t('passwordsNotMatching')}!`)
                    return
                }

                if (studentRole?.id) {
                    if (form.roleId === studentRole.id) {
                        if (isNewUser) createStudent({ studentCreate: getStudentCreateDTO(form) })
                        else updateStudent({
                            userId,
                            studentUpdate: getStudentUpdateDTO(form),
                        })
                    } else {
                        if (isNewUser) createTeacher({ teacherCreate: getTeacherCreateDTO(form) })
                        else updateTeacher({
                            userId,
                            teacherUpdate: getTeacherUpdateDTO(form),
                        })
                    }
                } else {
                    toast(`Exception: student role id not found`)
                }
            },
        )

    useEffect(() => {
        setForm(getFormStateFromUser(user))
    }, [setForm, user])

    if (isLoadingRoles || isLoadingUser && isFetchingUser) return <Loading />
    if (rolesError) return <DisplayError error={rolesError} />
    if (userError) return <DisplayError error={userError} />
    if (!roles) return <DisplayError error={Error('No roles in the system.')} />
    if (!studentRole) return <DisplayError error={Error('No "user" role in the system.')} />
    if (!teacherRole) return <DisplayError error={Error('No "teacher" role in the system.')} />

    return <form className="mx-auto flex flex-col gap-8" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 place-content-center gap-y-3">
            <span className="font-semibold inline-flex place-items-center">{t('lastName')}:</span>
            <Input
                required
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={onFieldChange}
            />

            <span className="font-semibold inline-flex place-items-center">{t('firstName')}:</span>
            <Input
                required
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={onFieldChange}
            />

            <span className="font-semibold inline-flex place-items-center">{t('email')}:</span>
            <Input
                required
                name="email"
                type="email"
                value={form.email}
                onChange={onFieldChange}
            />

            {
                isNewUser && (<>
                    <span className="font-semibold inline-flex place-items-center">{t('password')}:</span>
                    <Password
                        required
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={onFieldChange}
                    />

                    <span className="font-semibold inline-flex place-items-center">{t('passwordConfirm')}:</span>
                    <Password
                        required
                        name="password"
                        type="password"
                        value={form.confirmPassword}
                        onChange={onFieldChange}
                    />
                </>)
            }

            <span className="font-semibold inline-flex place-items-center">{t('role')}:</span>
            <Select
                required
                name="roleId"
                value={form.roleId}
                disabled={!isNewUser && form.roleId === studentRole.id}
                onChange={onFieldChange}
            >
                <option disabled hidden value="">
                    {t('selectRole')}
                </option>
                {
                    roles.map(r => <option key={r.id} value={r.id} hidden={!isNewUser && r.id === studentRole.id}>
                        {t(`roles.${r.name}`)}
                    </option>)
                }
            </Select>

            <hr className="col-span-2 my-3 border-cs-neutral" />

            {form.roleId === studentRole.id && (
                <>
                    <span className="font-semibold inline-flex place-items-center">{t('degree')}:</span>
                    <Select
                        required
                        name="degree"
                        value={form.degree}
                        onChange={onFieldChange}
                    >
                        <option disabled hidden value="">
                            {t('selectYourDegree')}
                        </option>
                        <option value="BACHELOR">
                            {t('degrees.bachelor')}
                        </option>
                        <option value="MASTER">
                            {t('degrees.master')}
                        </option>
                    </Select>

                    <span className="font-semibold inline-flex place-items-center">{t('faculty')}:</span>
                    <Input
                        required
                        name="faculty"
                        type="text"
                        value={form.faculty}
                        onChange={onFieldChange}
                    />

                    <span className="font-semibold inline-flex place-items-center">{t('studentGroup')}:</span>
                    <Input
                        required
                        name="group"
                        type="text"
                        value={form.group}
                        onChange={onFieldChange}
                    />


                    <span className="font-semibold inline-flex place-items-center">{t('graduationYear')}:</span>
                    <Input
                        required
                        name="gradYear"
                        type="date"
                        value={form.gradYear}
                        onChange={onFieldChange}
                    />
                </>
            )}

            {!!form.roleId && form.roleId !== studentRole.id && (
                <>
                    <span className="font-semibold inline-flex place-items-center">{t('bachelorStudentLimit')}:</span>
                    <Input
                        required
                        name="bachelorStudentLimit"
                        type="number"
                        value={form.bachelorStudentLimit}
                        onChange={onFieldChange}
                    />

                    <span className="font-semibold inline-flex place-items-center">{t('masterStudentLimit')}:</span>
                    <Input
                        required
                        name="masterStudentLimit"
                        type="number"
                        value={form.masterStudentLimit}
                        onChange={onFieldChange}
                    />
                </>
            )}
        </div>
        <div className="flex flex-row gap-4 place-items-center justify-end">
            <Link to={isNewUser ? routes.hod.users.aRoot : routes.hod.users.aUser(userId)}
                  className="text-cs-warning">{t('cancel')}</Link>
            <Button>{t('submit')}</Button>
        </div>
    </form>
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

function getTeacherCreateDTO(form: IUserUpdateForm): ITeacherSignUpDTO {
    return {
        lastName: form.lastName,
        firstName: form.firstName,
        email: form.email,
        password: form.password,
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