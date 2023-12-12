import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { signUpStudent, signUpTeacher } from '~/backend'
import {
    Button,
    Input,
    Password,
    ProjectLogo,
    Select,
    toast,
    Toggle,
    WithNulpBg,
} from '~/components'
import { useForm } from '~/hooks'
import { getStudentSignUpDTO, getTeacherSignUpDTO, ISignUpForm } from '~/models'
import { routes } from '~/pages'

export function SignUp() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { mutate } = useMutation({
        mutationFn: async (signUpForm: ISignUpForm) => {
            if (form.isStudent)
                return await signUpStudent(getStudentSignUpDTO(signUpForm))
            return await signUpTeacher(getTeacherSignUpDTO(signUpForm))
        },
        onSuccess: () => {
            toast(`${t('signUpSuccessful')}!`)
            navigate(`/${routes.signIn}`)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    toast(`${t('error.userWithEmailExists')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
    const { form, onFieldChange, onCheckboxFieldChange, onSubmit } =
        useForm<ISignUpForm>(
            {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                isStudent: false,
                faculty: '',
                group: '',
                gradDate: '',
                gradLevel: '',
            },
            (form) => {
                if (form.password !== form.confirmPassword) {
                    toast(`${t('passwordsNotMatching')}!`)
                    return
                }
                mutate(form)
            }
        )

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
                <form
                    onSubmit={onSubmit}
                    className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'
                >
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
                            name='password'
                            type='password'
                            value={form.password}
                            onChange={onFieldChange}
                            placeholder={t('enterYourPassword')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label className='text-left'>
                            {t('passwordConfirm')}
                        </label>
                        <Password
                            required
                            name='confirmPassword'
                            type='password'
                            value={form.confirmPassword}
                            onChange={onFieldChange}
                            placeholder={t('confirmYourPassword')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <Toggle
                            name='isStudent'
                            checked={form.isStudent}
                            onChange={onCheckboxFieldChange}
                            label={t('registerAsStudent')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            {t('faculty')}
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name={'faculty'}
                            type='text'
                            value={form.faculty}
                            onChange={onFieldChange}
                            placeholder={t('nameOfFaculty')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            {t('studentGroup')}
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='group'
                            type='text'
                            value={form.group}
                            onChange={onFieldChange}
                            placeholder={t('studentGroupNumber')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            {t('graduationYear')}
                        </label>
                        <Input
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='gradDate'
                            type='date'
                            value={form.gradDate}
                            onChange={onFieldChange}
                            placeholder={t('enterGraduationYear')}
                        />
                    </div>
                    <div className='flex flex-col'>
                        <label hidden={!form.isStudent} className='text-left'>
                            {t('degree')}
                        </label>
                        <Select
                            hidden={!form.isStudent}
                            required={form.isStudent}
                            name='gradLevel'
                            value={form.gradLevel}
                            onChange={onFieldChange}
                        >
                            <option disabled hidden value=''>
                                {t('selectYourDegree')}
                            </option>
                            <option value='BACHELOR'>
                                {t('degrees.bachelor')}
                            </option>
                            <option value='MASTER'>
                                {t('degrees.master')}
                            </option>
                        </Select>
                    </div>
                    <Button>{t('signUpSubmit')}</Button>
                    <div className='self-start'>
                        {t('registeredAlready')}?
                        <Link to={`/${routes.signIn}`} className='ml-4'>
                            {t('signIn')}
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}
