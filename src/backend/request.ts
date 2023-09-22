import axios from 'axios'
import endpoints from '~/backend/endpoints.ts'

export function useGetRequestsTeacher() {
    return () => axios.get(endpoints.getAllRequestsTeacher)
}
