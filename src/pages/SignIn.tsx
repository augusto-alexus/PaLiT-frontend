import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { signIn } from '~/backend'
import {
    Button,
    Checkbox,
    Input,
    Password,
    ProjectLogo,
    toast,
    WithNulpBg,
} from '~/components'
import { useForm } from '~/hooks'
import { routes } from '~/pages'
import { useAuthStore } from '~/store'

export function SignIn() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const authStore = useAuthStore()
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: async ({
            email,
            password,
        }: {
            email: string
            password: string
        }) => signIn({ email, password }),
        onSuccess: async ({ accessToken }) => {
            authStore.reset()
            authStore.setAccessToken(accessToken)
            await queryClient.resetQueries()
            navigate(`/${routes.authRedirect}`)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    toast(`${t('error.wrongCredentials')}!`)
                } else {
                    toast(`${t('error.unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('error.unknownError')}!`)
            }
        },
    })
    const { form, onFieldChange, onCheckboxFieldChange, onSubmit } =
        useForm<ISignInForm>(
            {
                email: '',
                password: '',
                rememberMe: false,
            },
            (form) =>
                mutation.mutate({ email: form.email, password: form.password })
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
                <form
                    onSubmit={onSubmit}
                    className='flex w-[19.5rem] flex-col gap-4 sm:w-[24rem] lg:w-[32rem]'
                >
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
                    <div className='flex-row-[24rem] flex'>
                        <Checkbox
                            label={t('rememberMe')}
                            name='rememberMe'
                            checked={form.rememberMe}
                            onChange={onCheckboxFieldChange}
                        />
                    </div>
                    <Button>{t('signInSubmit')}</Button>
                    <div className='self-start'>
                        {t('notRegisteredYet')}
                        <Link to={`/${routes.signUp}`} className='ml-4'>
                            {t('signUp')}
                        </Link>
                    </div>
                </form>
            </main>
        </div>
    )
}

interface ISignInForm {
    email: string
    password: string
    rememberMe: boolean
}
