import axios from './base'
import endpoints from '~/backend/endpoints.ts'
import { getThemeFromDTO, IThemeDTO } from '~/models'

export async function updateTheme(studentId: string, newTheme: string) {
    const formData = new FormData()
    formData.append('theme', newTheme)
    const response = await axios.put(endpoints.theme.updateTheme(studentId), formData)
    return {
        response,
        studentId,
    }
}

export async function getTheme(studentId: string) {
    const response = await axios.get(endpoints.theme.getTheme(studentId))
    return getThemeFromDTO(response.data as IThemeDTO)
}
