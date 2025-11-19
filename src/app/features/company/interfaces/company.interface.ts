import { QueryParmsInterface } from "../../../shared/interfaces/apiresponce.interface";

export interface ApplicationQureryInterface extends QueryParmsInterface {
    jobId :string
}

export interface CancelInterviewInterface {
    applicationId:string,

    stage:string,

    userEmail:string
}