export interface SheduleInterface{

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

export interface updatefeedbackInterface {

  interviewId: string,

  feedback: string,

  result: string
}

export interface FinalizeResultInterface {

  finalResult: string;

  finalFeedback: string;

  interviewId?: string;

}

export interface PanalInterface {
  interviewerId?: string;
  
  interviewerName: string;

  feedback?: string;

  result?: string;
}

export interface SheduleResponceInterface {
  _id: string;

  applicationId: string;

  scheduledBy: string;

  userEmail: string;

  stage: string;

  scheduledDate: string;

  scheduledTime: string;

  meetingLink?: string;

  status: string;

  evaluators: PanalInterface[];

  overallFeedback?: string;

  finalResult?: string;

  updatedAt:string;
}