import axios from 'axios'
import endpoints from './endpoints'

export interface IStudentRequestDTO {
    firstName: string
    lastName: string
    degree: string
    faculty: string
    cluster: string
}

function parseStudentRequest(data: IStudentRequestDTO[]) {
    return data.map((s) => ({
        ...s,
        degree: s.degree === 'BACHELOR' ? 'Бакалавр' : 'Магістр',
    }))
}

export function useGetAllStudents(): () => Promise<IStudentRequestDTO[]> {
    return () =>
        axios
            .get(endpoints.getAllStudents)
            .then(({ data }) =>
                parseStudentRequest(data as IStudentRequestDTO[])
            )
}
