export interface ScheduleInterface{

  applicationId: string;

  candidateId? :string;

  hrId: string;

  hrName: string;

  stage: string;

  scheduledDate: string;

  scheduledTime: string;

  userEmail:string;

  interviewers?: string[];

  meetingLink?: string;

}

export interface UpdateFeedbackInterface {

  interviewId: string,

  feedback: string,

  result: string
}

export interface FinalizeResultInterface {

  finalResult: string;

  applicationId:string;

  nextStage:string;

  finalFeedback: string;

  interviewId?: string;

}

export interface PanelInterface {
  interviewerId?: string;

  interviewerName: string;

  feedback?: string;

  result?: string;
}

export interface ScheduleResponseInterface {
  _id: string;

  applicationId: string;

  scheduledBy: string;

  userEmail: string;

  stage: string;

  scheduledDate: string;

  scheduledTime: string;

  meetingLink?: string;

  status: string;

  evaluators: PanelInterface[];

  overallFeedback?: string;

  finalResult?: string;

  updatedAt:string;
}