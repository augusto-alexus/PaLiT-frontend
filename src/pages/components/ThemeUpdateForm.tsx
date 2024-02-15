import { useEffect, useState } from 'react'
import { Button, Input } from '~/components'
import { useTranslation } from 'react-i18next'
import { useGetTheme, useThemeUpdate } from '~/hooks'
import { InfoRow } from '~/pages/components/SidebarContainer.tsx'

export function ThemeUpdateForm({ studentId }: { studentId: string }) {
    const { t } = useTranslation()
    const { data: currentTheme } = useGetTheme(studentId)
    const { mutate: updateTheme } = useThemeUpdate(() => setUpdateMode(false))
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const [newTheme, setNewTheme] = useState<string>('')
    useEffect(() => {
        setNewTheme(currentTheme?.theme ?? '')
    }, [currentTheme, updateMode])
    if (updateMode)
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    updateTheme({ studentId, newTheme })
                }}
            >
                <hr className='my-4 border-t border-cs-additional-gray' />
                <p className='mb-4'>{t('theme')}</p>
                <Input value={newTheme} onChange={(e) => setNewTheme(e.target.value)} />
                <div className='mt-4 flex flex-row justify-end gap-4'>
                    <Button type='submit'>{t('submit')}</Button>
                    <Button className='bg-cs-additional-gray' onClick={() => setUpdateMode(false)}>
                        {t('cancel')}
                    </Button>
                </div>
            </form>
        )
    return (
        <div className='flex flex-col gap-4'>
            <InfoRow infoKey={t('projectInfo.theme')} value={currentTheme?.theme} />
            <Button onClick={() => setUpdateMode(true)}>{t('changeTheme')}</Button>
        </div>
    )
}
