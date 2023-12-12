import axios from 'axios'
import { Role } from '~/models'
import { getAuthConfig } from './base'
import endpoints from './endpoints'

export async function postComment(
    accessToken: string,
    documentId: number,
    studentId: number,
    teacherId: number,
    comment: string,
    authorRole: Role
) {
    await axios.post(
        endpoints.comments.postComment(documentId, studentId, teacherId),
        {
            text: comment,
            fromType: authorRole.toUpperCase(),
        },
        getAuthConfig(accessToken)
    )

    return documentId
}

export async function getComments(accessToken: string, documentId: number) {
    const response = await axios.get(
        endpoints.comments.getComments(documentId),
        getAuthConfig(accessToken)
    )
    return (response.data as ICommentDTO[]).map(getCommentFromDTO)
}

function getCommentFromDTO(dto: ICommentDTO): IComment {
    return {
        text: dto.text,
        from: dto.fromType.toLowerCase() as Role,
        createdAt: dto.createdDate,
    }
}

interface ICommentDTO {
    text: string
    fromType: 'STUDENT' | 'TEACHER'
    createdDate: string
}

export interface IComment {
    text: string
    from: Role
    createdAt: string
}
