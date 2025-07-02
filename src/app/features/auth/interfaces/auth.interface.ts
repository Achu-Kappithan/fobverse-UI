
export interface CandidateRegistration {
    fullName: string,
    email : string,
    password: string,
    role: string
}

export interface  loginInterface {
    email:string,
    password:string,
    role: string
}

export interface  passwordUpdate {
    password:string,
    token:string
}

export interface validateEmailAndRole {
    email:string
    role:string
}

