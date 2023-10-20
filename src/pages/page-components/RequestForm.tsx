import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import {
    IRequestDTO,
    makeStudent2TeacherRequest,
    makeTeacher2StudentRequest,
} from '~/backend'
import { Button, Input, Select, toast } from '~/components'
import { useForm } from '~/hooks'
import { useAccessToken } from '~/hooks/useAccessToken.ts'
import { useCurrentUser } from '~/hooks/useCurrentUser.ts'

interface IRequestForm {
    theme: string
    language: 'UA' | 'ENG' | ''
}

export function RequestForm({ userId }: { userId: number }) {
    const { t } = useTranslation()
    const accessToken = useAccessToken()
    const currentUser = useCurrentUser()
    const queryClient = useQueryClient()
    const { mutate } = useMutation({
        mutationFn: async (requestDTO: IRequestDTO) => {
            if (currentUser.role === 'student')
                return makeStudent2TeacherRequest(requestDTO)
            return makeTeacher2StudentRequest(requestDTO)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries(['requests'])
            toast('Запрошення відправлено!')
        },
        onError: (error) => {
            if (error instanceof AxiosError) {
                if (error.response?.status === 403) {
                    if (currentUser.role === 'teacher')
                        toast(`${t('error.studentAlreadyHasTeacher')}!`)
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
                toast('Мова не може бути порожньою')
                return
            }
            mutate({
                accessToken,
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
                    placeholder='Введіть Вашу тему'
                />
            </div>
            <div className='flex flex-col'>
                <Select
                    required
                    name='language'
                    value={form.language}
                    onChange={onFieldChange}
                >
                    <option disabled hidden value=''>
                        Виберіть мову
                    </option>
                    <option value='UA'>Українська</option>
                    <option value='ENG'>English</option>
                </Select>
            </div>
            <Button>Відправити запит</Button>
        </form>
    )
}
