export interface SheduleInterface{

  applicationId: string;

  hrId: string;

  hrName: string;

  stage: string;

  scheduledDate: string;

  scheduledTime: string;

  userEmail:string;

}
export interface PanalInterface {
  interviewerName: string;

  feedback?: string;

  result: string;
}

export interface SheduleResponceInterface {
  _id: string;

  applicationId: string;

  hrId: string;

  hrName: string;

  stage: string;

  scheduledDate: string;

  scheduledTime: string;

  meetingLink?: string;

  status: string;

  panel: PanalInterface | []

  overallFeedback?: string;

  finalResult?: string;
}