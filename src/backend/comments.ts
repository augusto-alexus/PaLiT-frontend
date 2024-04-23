import axios from './base.ts'
import endpoints from './endpoints'
import { handleError } from './error.ts'

export async function postComment(documentId: string, userId: string, comment: string) {
    return axios
        .post(endpoints.comments.postComment(documentId, userId), { text: comment })
        .then(() => documentId)
        .catch(handleError())
}

export async function getComments(documentId: string) {
    return axios
        .get(endpoints.comments.getComments(documentId))
        .then(({ data }) => (data as ICommentDTO[]).map(getCommentFromDTO))
        .catch(handleError())
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
