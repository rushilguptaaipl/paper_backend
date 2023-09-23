import { registerEnumType } from "@nestjs/graphql";

export enum DatesheetType{
    FIRST_MST = "FIRST MST",
    SECOND_MST = "SECOND MST",
    THIRD_MST = " THIRD MST",
    FINAL_EXAM = "FINAL EXAM"
}

registerEnumType(DatesheetType,{name:"DatesheetType"})