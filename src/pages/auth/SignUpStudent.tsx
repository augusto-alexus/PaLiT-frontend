import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, DisplayError, Input, Password, Select, toast } from '~/components'
import { useForm, useStudentSignUp } from '~/hooks'
import { routes } from '~/pages'
import { ISignUpStudentForm } from '~/models'

export function SignUpStudent() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')
    const { mutate: signUp } = useStudentSignUp(() => {
        toast(`${t('signUpSuccessful')}!`)
        navigate(`/${routes.signIn}`)
    })
    const { form, onFieldChange, onSubmit } = useForm<ISignUpStudentForm>(
        {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
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
                <Input
                    required
                    name='gradDate'
                    type='date'
                    value={form.gradDate}
                    onChange={onFieldChange}
                    placeholder={t('enterGraduationYear')}
                />
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
