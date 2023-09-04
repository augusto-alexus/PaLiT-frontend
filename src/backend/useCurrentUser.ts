import axios from 'axios'
import { toast } from '~/components'
import { endpoints } from './endpoints'

export interface IRoleDTO {
    id: number
    name: string
    roleId: number
}

export interface ICurrentUserDTO {
    firstName: string
    lastName: string
    email: string
    password: string
    userId: number
    role: IRoleDTO
    id: number
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
                if (data satisfies ICurrentUserDTO) {
                    onSuccess?.(data as ICurrentUserDTO)
                } else {
                    toast('Incoming data format error!')
                    console.error(`Badly formatted incoming data:`, data)
                }
            })
            .catch((err) => {
                toast(`Error! ${err}`)
            })
    }
}
