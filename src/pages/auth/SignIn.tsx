import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Password, ProjectLogo, WithNulpBg } from '~/components'
import { useForm, useSignIn } from '~/hooks'
import { routes } from '~/pages'

export function SignIn() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { mutate: signIn } = useSignIn(() => navigate(`/${routes.authRedirect}`))
    const { form, onFieldChange, onSubmit } = useForm<ISignInForm>(
        {
            email: '',
            password: '',
        },
        (form) => signIn({ email: form.email, password: form.password })
    )

    return (
        <div className='flex h-full place-content-center items-center'>
            <WithNulpBg />
            <main className='flex flex-col gap-4 rounded-2xl bg-white px-8 py-12 drop-shadow-2xl sm:px-20 sm:py-16 md:px-[25vw] md:py-24 lg:px-64'>
                <div className='mb-8 place-self-center'>
                    <ProjectLogo />
                </div>
                <h1 className='mb-16 text-center font-[Montserrat] text-2xl font-bold text-cs-text-dark'>
                    {t('signInTitle')}
                </h1>
                <form onSubmit={onSubmit} className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'>
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
                            value={form.password}
                            onChange={onFieldChange}
                            placeholder={t('enterYourPassword')}
                        />
                    </div>
                    <Button className='mt-8'>{t('signInSubmit')}</Button>
                </form>
            </main>
        </div>
    )
}

interface ISignInForm {
    email: string
    password: string
}
