import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export interface IStageDTO {
    stageId: number
    name: string
    serialOrder: number
}

export function getAllStages(accessToken: string) {
    return axios
        .get(endpoints.stages.getAll, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        .then(({ data }) => data as IStageDTO[])
}
