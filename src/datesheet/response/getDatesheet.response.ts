import { plainToClass } from "class-transformer";
import { Semester } from "../enum/semester.enum";

export class DatesheetSubjectResponse {
    id: number
    subject: string
    subject_code: string
}

export class DatesheetYearResponse {
    id: number
    year: number
}

export class DatesheetCourseResponse {
    id: number
    stream: string
    branch: string
}

export class DatesheetResponse {
    id: number
    subject: DatesheetSubjectResponse
    year: DatesheetYearResponse
    course: DatesheetCourseResponse
    date: string
    time: string
    semester: Semester
}



export class GetDatesheetResponse {
    datesheet: DatesheetResponse[]

    static decode(input: any): GetDatesheetResponse { return plainToClass(this, input) }
}