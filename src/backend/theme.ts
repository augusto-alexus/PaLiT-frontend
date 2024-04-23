import axios from './base'
import endpoints from '~/backend/endpoints.ts'
import { getThemeFromDTO, IThemeDTO } from '~/models'
import { CantUpdateThemeError, handleError } from '~/backend/error.ts'

export async function updateTheme(studentId: string, newTheme: string) {
    const formData = new FormData()
    formData.append('theme', newTheme)
    return axios
        .put(endpoints.theme.updateTheme(studentId), formData)
        .then((response) => ({ response, studentId }))
        .catch(
            handleError(({ status }) => {
                if (status === 403) throw new CantUpdateThemeError()
            })
        )
}

export async function getTheme(studentId: string) {
    return axios
        .get(endpoints.theme.getTheme(studentId))
        .then(({ data }) => getThemeFromDTO(data as IThemeDTO))
        .catch(handleError())
}
