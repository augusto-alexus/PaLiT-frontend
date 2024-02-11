import { IStageDTO } from '~/backend/stages.ts'
import { Role } from '~/models'
import endpoints from './endpoints'
import axios from './base.ts'

export async function postComment(
    documentId: number,
    stageId: number,
    studentId: number,
    teacherId: number,
    comment: string,
    authorRole: Role
) {
    await axios.post(endpoints.comments.postComment(documentId, studentId, teacherId, stageId), {
        text: comment,
        fromType: authorRole.toUpperCase(),
    })

    return documentId
}

export async function getComments(documentId: number) {
    const response = await axios.get(endpoints.comments.getComments(documentId))
    return (response.data as ICommentDTO[]).map(getCommentFromDTO)
}

function getCommentFromDTO(dto: ICommentDTO): IComment {
    return {
        text: dto.text,
        from: dto.fromType.toLowerCase() as Role,
        stageId: dto.stageDTO.stageId,
        createdAt: dto.createdDate,
    }
}

interface ICommentDTO {
    text: string
    fromType: 'STUDENT' | 'TEACHER'
    stageDTO: IStageDTO
    createdDate: string
}

export interface IComment {
    text: string
    from: Role
    stageId: number
    createdAt: string
}
