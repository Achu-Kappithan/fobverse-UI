import { QueryParmsInterface } from "../../../shared/interfaces/api-response.interface";

export interface ApplicationQureryInterface extends QueryParmsInterface {
    jobId :string
}

export interface CancelInterviewInterface {
    applicationId:string,

    stage:string,

    userEmail:string
}