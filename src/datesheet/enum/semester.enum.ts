import { registerEnumType } from "@nestjs/graphql";

export enum Semester{
    FIRST_SEM = "FIRST",
    SECOND_SEM="SECOND",
    THIRD_SEM = "THIRD",
    FOURTH_SEM = "FOURTH",
    FIFTH_SEM = "FIFTH",
    SIXTH_SEM = "SIXTH",
    SEVENTH_SEM = "SEVENTH",
    EIGTH_SEM = "EIGTH"
}

registerEnumType(Semester,{name:"Semester"})