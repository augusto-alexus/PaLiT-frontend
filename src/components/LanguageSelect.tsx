import { Select } from './Input.tsx'
import { Language } from '~/models'
import { useTranslation } from 'react-i18next'
import { ChangeEvent } from 'react'

export function LanguageSelect({
    value,
    onChange,
}: {
    value: Language | ''
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
}) {
    const { t } = useTranslation()
    return (
        <Select required name='language' value={value} onChange={onChange}>
            <option disabled hidden value=''>
                {t('selectLanguage')}
            </option>
            <option value='UA'>Українська</option>
            <option value='ENG'>English</option>
        </Select>
    )
}
