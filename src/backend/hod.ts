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
