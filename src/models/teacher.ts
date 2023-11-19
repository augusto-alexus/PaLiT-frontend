import { IMyStudentDTO, IStageDTO } from '~/backend'
import { Language } from './common'
import { IStudent, parseStudentDTO } from './student'

export interface ITeacher {
    teacherId: number
    firstName: string
    lastName: string
}

export interface IMyStudent {
    language: Language
    theme: string
    stage?: IStageDTO
    headApproved: boolean
    student: IStudent
}

export function parseMyStudentDTO(dto: IMyStudentDTO): IMyStudent {
    return {
        language: dto.language,
        theme: dto.theme,
        stage: dto.stageDTO,
        headApproved: !!dto.headApprove,
        student: parseStudentDTO(dto.studentRequestDTO),
    }
}
