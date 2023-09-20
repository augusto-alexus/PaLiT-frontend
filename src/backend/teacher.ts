import axios from 'axios'
import { endpoints } from './endpoints'

export interface ITeacherRequestDTO {
    firstName: string
    lastName: string
}

export function useGetAllTeachers() {
    return () =>
        axios
            .get(endpoints.getAllTeachers)
            .then(({ data }) => data as ITeacherRequestDTO[])
}
