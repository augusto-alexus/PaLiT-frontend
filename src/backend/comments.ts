import { IStageDTO } from './stages.ts'
import endpoints from './endpoints'
import axios from './base.ts'

export async function postComment(documentId: string, userId: string, comment: string) {
    await axios.post(endpoints.comments.postComment(documentId, userId), { text: comment })
    return documentId
}

export async function getComments(documentId: number) {
    const response = await axios.get(endpoints.comments.getComments(documentId))
    return (response.data as ICommentDTO[]).map(getCommentFromDTO)
}

function getCommentFromDTO(dto: ICommentDTO): IComment {
    return {
        text: dto.text,
        userId: dto.userId,
        stageId: dto.stageDTO.stageId,
        createdAt: dto.createdDate,
    }
}

interface ICommentDTO {
    text: string
    userId: string
    stageDTO: IStageDTO
    createdDate: string
}

export interface IComment {
    text: string
    userId: string
    stageId: number
    createdAt: string
}
