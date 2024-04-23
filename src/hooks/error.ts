import { useTranslation } from 'react-i18next'
import { BaseError } from '~/backend'
import { toast } from '~/components'

export function useErrorHandler() {
    const { t } = useTranslation()
    return (error: unknown) => {
        if (error instanceof BaseError) {
            toast(
                `${t(error.i18nMessage, { ...error.i18Args })}! ${error?.backendMessage ?? ''}`,
                error.toastAutoCloseDelay
            )
        } else {
            toast(`${t('error.unknownError')}!`)
        }
        return error
    }
}
