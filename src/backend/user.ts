import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export async function getAllUsers() {
    const response = await axios.get(endpoints.user.getAll)
    return response.data as IUser[]
}

export async function getUserById(id: string) {
    const response = await axios.get(endpoints.user.getById(id))
    return response.data
}

export interface IUser {
    userId: number
    email: string
    firstName: string
    lastName: string
}
