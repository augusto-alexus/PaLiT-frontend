import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, DisplayError, Input, Password, toast } from '~/components'
import { useForm, useTeacherSignUp } from '~/hooks'
import { ISignUpTeacherForm } from '~/models'
import { routes } from '~/pages'

export function SignUpTeacher() {
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
