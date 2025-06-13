import { Routes } from '@angular/router';
import { Candidates } from './features/auth/components/candidates/candidates';
import { CandidateLogin } from './features/auth/components/candidates/candidate-login/candidate-login';
import { CandidateSignup } from './features/auth/components/candidates/candidate-signup/candidate-signup';
import { EmailVerificationFaild } from './features/auth/components/email-verification/email-verification-faild/email-verification-faild';
import { EmailVerificationSuccess } from './features/auth/components/email-verification/email-verification-success/email-verification-success';
import { EmailVerification } from './features/auth/components/email-verification/email-verification';

export const routes: Routes = [
    {
        path:"",
        component : Candidates,
        children:[
            {path:"login", component : CandidateLogin},
            {path:"signup", component: CandidateSignup},
            {path: "",redirectTo:'login', pathMatch:'full'}
        ]
    },
    { path:"email-verification", component:EmailVerification},
    { path:"verification-failed", component:EmailVerificationFaild},
    { path:"verification-success", component:EmailVerificationSuccess}
];
