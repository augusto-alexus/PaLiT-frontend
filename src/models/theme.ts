import { Language } from './common'

export interface ITheme {
    id: string
    theme: string
    lang: Language
}

export interface IThemeDTO {
    themeId: number
    theme: string
    language: string
    date: string | null
    deadLineDate: string | null
}

export function getThemeFromDTO(dto: IThemeDTO): ITheme {
    return {
        id: dto.themeId.toString(),
        theme: dto.theme,
        lang: dto.language as Language,
    }
}
