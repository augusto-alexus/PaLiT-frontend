import axios from 'axios'
import { IHoDRequestDTO } from '~/backend/hod.types.ts'
import { IHoDRequest, parseHoDRequestDTO } from '~/models'
import { getAuthConfig } from './base.ts'
import endpoints from './endpoints.ts'

export async function getAllRequests(
    accessToken: string
): Promise<IHoDRequest[]> {
    const response = await axios.get(
        endpoints.hod.getAllRequests,
        getAuthConfig(accessToken)
    )
    return (response.data as IHoDRequestDTO[]).map(parseHoDRequestDTO)
}

export async function updateRequest(
    accessToken: string,
    requestId: number,
    approved: boolean
): Promise<[boolean, boolean]> {
    const formData = new FormData()
    formData.append('approved', String(approved))
    const response = await axios.put(
        endpoints.hod.updateRequest(requestId),
        formData,
        getAuthConfig(accessToken)
    )
    return [response.status === 200, approved]
}
