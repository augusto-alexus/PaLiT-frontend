import { useAllHoDRequests } from '~/hooks/requests.ts'
import { useAllStudents } from '~/hooks/students.ts'
import { useAllTeachers } from '~/hooks/teachers.ts'
import { IStudent, ITeacher } from '~/models'

export function useGetAllTeams() {
    const requestsQuery = useAllHoDRequests()
    const studentsQuery = useAllStudents()
    const teachersQuery = useAllTeachers()

    const teamsLoading =
        requestsQuery.isInitialLoading || studentsQuery.isInitialLoading || teachersQuery.isInitialLoading

    const everythingReady =
        !teamsLoading &&
        (requestsQuery.data?.length ?? 0) > 0 &&
        (studentsQuery.data?.length ?? 0) > 0 &&
        (teachersQuery.data?.length ?? 0) > 0

    const teams = everythingReady
        ? requestsQuery.data?.reduce((res, req) => {
              if (!req.teamApproved) return res
              const t = teachersQuery.data?.find((t) => t.teacherId === req.teacherId)
              const s = studentsQuery.data?.find((s) => s.studentId === req.studentId)
              if (t && s) {
                  res.push({
                      student: s,
                      teacher: t,
                      projectInfo: {
                          id: req.id.toString(),
                          theme: req.theme,
                      },
                  })
              }
              return res
          }, [] as ITeam[])
        : undefined

    const teamsQueryError = requestsQuery.error || studentsQuery.error || teachersQuery.error

    return {
        requestsQuery,
        studentsQuery,
        teachersQuery,
        teams,
        teamsLoading,
        teamsQueryError,
    }
}

export interface ITeam {
    student: IStudent
    teacher: ITeacher
    projectInfo: {
        id: string
        theme: string
    }
}
