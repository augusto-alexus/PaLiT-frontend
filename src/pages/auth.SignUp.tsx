import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, DisplayError, Input, Password, ProjectLogo, Select, toast, WithNulpBg } from '~/components'
import { useForm, useStudentSignUp, useTeacherSignUp } from '~/hooks'
import { ISignUpStudentForm, ISignUpTeacherForm } from '~/models'
import { routes } from '~/pages'

export function SignUpRoot() {
    const { t } = useTranslation()
    return (
        <div className='flex h-full place-content-center items-center'>
            <WithNulpBg />
            <main className='flex flex-col gap-4 rounded-2xl bg-white px-8 py-12 drop-shadow-2xl sm:px-20 sm:py-16 md:px-[25vw] md:py-24 lg:px-64'>
                <div className='mb-8 place-self-center'>
                    <ProjectLogo />
                </div>
                <h1 className='text-center font-[Montserrat] text-2xl font-bold text-cs-text-dark'>
                    {t('signUpTitle')}
                </h1>
                <Outlet />
                <div className='self-start'>
                    {t('registeredAlready')}?
                    <Link to={`/${routes.signIn}`} className='ml-4'>
                        {t('signIn')}
                    </Link>
                </div>
            </main>
        </div>
    )
}

export function SignUpStudentPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { mutate: signUp } = useStudentSignUp(() => {
        toast(`${t('signUpSuccessful')}!`)
        navigate(routes.aSignIn)
    })
    const currentYear = new Date().getFullYear()
    const { form, onFieldChange, onSubmit } = useForm<ISignUpStudentForm>(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            faculty: '',
            group: '',
            gradYear: '',
            gradLevel: '',
        },
        (form) => {
            if (form.password !== form.confirmPassword) {
                toast(`${t('passwordsNotMatching')}!`)
                return
            }
            if (token) signUp({ form, token })
        }
    )

    if (!token) return <DisplayError error={Error('No token for registration')} />

    return (
        <form onSubmit={onSubmit} className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'>
            <div className='flex flex-col'>
                <label className='text-left'>{t('lastName')}</label>
                <Input
                    required
                    name='lastName'
                    type='text'
                    value={form.lastName}
                    onChange={onFieldChange}
                    placeholder={t('enterYourLastName')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('firstName')}</label>
                <Input
                    required
                    name='firstName'
                    type='text'
                    value={form.firstName}
                    onChange={onFieldChange}
                    placeholder={t('enterYourFirstName')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('email')}</label>
                <Input
                    required
                    autoComplete='email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={onFieldChange}
                    placeholder={t('enterYourEmail')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('password')}</label>
                <Password
                    required
                    autoComplete='new-password'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={onFieldChange}
                    placeholder={t('enterYourPassword')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('passwordConfirm')}</label>
                <Password
                    required
                    autoComplete='new-password'
                    name='confirmPassword'
                    type='password'
                    value={form.confirmPassword}
                    onChange={onFieldChange}
                    placeholder={t('confirmYourPassword')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('faculty')}</label>
                <Input
                    required
                    name={'faculty'}
                    type='text'
                    value={form.faculty}
                    onChange={onFieldChange}
                    placeholder={t('nameOfFaculty')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('studentGroup')}</label>
                <Input
                    required
                    name='group'
                    type='text'
                    value={form.group}
                    onChange={onFieldChange}
                    placeholder={t('studentGroupNumber')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('graduationYear')}</label>
                <Select required name='gradYear' value={form.gradYear} onChange={onFieldChange}>
                    <option disabled hidden value=''>
                        {t('enterGraduationYear')}
                    </option>
                    {[...Array(3).keys()].map((yearIdx) => {
                        const val = (currentYear + yearIdx).toString()
                        return (
                            <option key={val} value={val}>
                                {val}
                            </option>
                        )
                    })}
                </Select>
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('degree')}</label>
                <Select required name='gradLevel' value={form.gradLevel} onChange={onFieldChange}>
                    <option disabled hidden value=''>
                        {t('selectYourDegree')}
                    </option>
                    <option value='BACHELOR'>{t('degrees.bachelor')}</option>
                    <option value='MASTER'>{t('degrees.master')}</option>
                </Select>
            </div>
            <Button className='mt-8'>{t('signUpSubmit')}</Button>
        </form>
    )
}

export function SignUpTeacherPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { mutate: signUp } = useTeacherSignUp(() => {
        toast(`${t('signUpSuccessful')}!`)
        navigate(`/${routes.signIn}`)
    })
    const { form, onFieldChange, onSubmit } = useForm<ISignUpTeacherForm>(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        (form) => {
            if (form.password !== form.confirmPassword) {
                toast(`${t('passwordsNotMatching')}!`)
                return
            }
            if (token) signUp({ form, token })
        }
    )

    if (!token) return <DisplayError error={Error('No token for registration')} />

    return (
        <form onSubmit={onSubmit} className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'>
            <div className='flex flex-col'>
                <label className='text-left'>{t('lastName')}</label>
                <Input
                    required
                    name='lastName'
                    type='text'
                    value={form.lastName}
                    onChange={onFieldChange}
                    placeholder={t('enterYourLastName')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('firstName')}</label>
                <Input
                    required
                    name='firstName'
                    type='text'
                    value={form.firstName}
                    onChange={onFieldChange}
                    placeholder={t('enterYourFirstName')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('email')}</label>
                <Input
                    required
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={onFieldChange}
                    placeholder={t('enterYourEmail')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('password')}</label>
                <Password
                    required
                    autoComplete='new-password'
                    name='password'
                    type='password'
                    value={form.password}
                    onChange={onFieldChange}
                    placeholder={t('enterYourPassword')}
                />
            </div>
            <div className='flex flex-col'>
                <label className='text-left'>{t('passwordConfirm')}</label>
                <Password
                    required
                    autoComplete='new-password'
                    name='confirmPassword'
                    type='password'
                    value={form.confirmPassword}
                    onChange={onFieldChange}
                    placeholder={t('confirmYourPassword')}
                />
            </div>
            <Button className='mt-8'>{t('signUpSubmit')}</Button>
        </form>
    )
}
