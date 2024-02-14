import endpoints from './endpoints'
import axios from './base.ts'

export async function postComment(documentId: string, userId: string, comment: string) {
    await axios.post(endpoints.comments.postComment(documentId, userId), { text: comment })
    return documentId
}

export async function getComments(documentId: string) {
    const response = await axios.get(endpoints.comments.getComments(documentId))
    return (response.data as ICommentDTO[]).map(getCommentFromDTO)
}

function getCommentFromDTO(dto: ICommentDTO): IComment {
    return {
        text: dto.text,
        userId: dto.userId,
        createdAt: dto.createdDate,
    }
}

interface ICommentDTO {
    text: string
    userId: string
    createdDate: string
}

export interface IComment {
    text: string
    userId: string
    createdAt: string
}
