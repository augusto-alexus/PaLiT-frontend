import axios from 'axios'
import { toast } from '~/components'
import { endpoints } from './endpoints'

export interface IRoleDTO {
    id: string
    name: string
}

export interface IStudentDTO {
    studentId: string
    degree: string
}

export interface ICurrentUserDTO {
    firstName: string
    lastName: string
    email: string
    userId: number
    roleDTO: IRoleDTO
    studentDTO: IStudentDTO
}

export function useCurrentUser(
    onSuccess?: (userData: ICurrentUserDTO) => void
) {
    return (accessToken: string) => {
        axios
            .get(endpoints.currentUser, {
                data: {
                    user: accessToken,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            .then(({ data }) => {
                onSuccess?.(data as ICurrentUserDTO)
            })
            .catch((err) => {
                toast(`Error! ${err}`)
            })
    }
}
