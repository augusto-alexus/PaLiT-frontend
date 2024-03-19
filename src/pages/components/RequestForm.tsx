import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { IRequestDTO, makeRequest } from '~/backend'
import { Button, Input, LanguageSelect, toast } from '~/components'
import { useCurrentUser, useForm } from '~/hooks'
import { Language } from '~/models'

interface IRequestForm {
    theme: string
    language: Language | ''
}

export function RequestForm({ userId }: { userId: number }) {
    const { t } = useTranslation()
    const currentUser = useCurrentUser()
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: async (requestDTO: IRequestDTO) => makeRequest(currentUser.role, requestDTO),
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            toast(`${t('invitationSent')}!`)
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    if (currentUser.role === 'teacher') toast(`${t('error.studentAlreadyHasTeacher')}!`)
                    else toast(`${t('error.inviteLimitTeacher')}!`)
                } else {
                    toast(`${t('unknownError')}! ${error.message}`)
                }
            } else {
                toast(`${t('unknownError')}!`)
            }
        },
    })
    const { form, onFieldChange, onSubmit } = useForm<IRequestForm>(
        {
            theme: '',
            language: '',
        },
        (form) => {
            if (form.language === '') {
                toast(t('languageCantBeEmpty'))
                return
            }
            mutate({
                userId,
                requestBody: {
                    theme: form.theme,
                    language: form.language,
                },
            })
        }
    )
    return (
        <form onSubmit={onSubmit} className='mt-4 flex flex-col gap-4'>
            <div className='flex flex-col'>
                <Input
                    required
                    name='theme'
                    type='text'
                    value={form.theme}
                    onChange={onFieldChange}
                    placeholder={t('selectYourTheme')}
                />
            </div>
            <div className='flex flex-col'>
                <LanguageSelect value={form.language} onChange={onFieldChange} />
            </div>
            <Button>{t('send')}</Button>
        </form>
    )
}
