import { useEffect, useState } from 'react'
import { Button, Input } from '~/components'
import { useTranslation } from 'react-i18next'
import { useGetTheme, useThemeUpdate } from '~/hooks'

export function ThemeUpdateForm({ studentId }: { studentId: string }) {
    const { t } = useTranslation()
    const { data: currentTheme } = useGetTheme(studentId)
    const { mutate: updateTheme } = useThemeUpdate()
    const [newTheme, setNewTheme] = useState<string>('')
    useEffect(() => {
        setNewTheme(currentTheme?.theme ?? '')
    }, [currentTheme])
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                updateTheme({ studentId, newTheme })
            }}
        >
            <label>{t('theme')}</label>
            <Input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} />
            <Button type='submit'>{t('submit')}</Button>
        </form>
    )
}
