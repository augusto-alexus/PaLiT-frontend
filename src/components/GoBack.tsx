import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export function GoBack() {
    const { t } = useTranslation()
    return (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // TODO: idk how to get rid of TS errors because of `-1` here
        <Link to={-1} className='text-sm'>
            <i className='ri-arrow-go-back-line' /> {t('navigation.goBack')}
        </Link>
    )
}
