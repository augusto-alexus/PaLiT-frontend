import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './locales/en/translations.json'
import uaTranslations from './locales/ua/translations.json'

void i18n.use(initReactI18next).init({
    resources: {
        en: {
            translations: enTranslations,
        },
        ua: {
            translations: uaTranslations,
        },
    },
    lng: 'ua',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    ns: ['translations'],
    defaultNS: 'translations',
})

i18n.languages = ['en', 'ua']

export default i18n
