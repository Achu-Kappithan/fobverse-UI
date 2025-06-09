import { Routes } from '@angular/router';
import { Candidates } from './features/auth/components/candidates/candidates';
import { Component } from '@angular/core';
import { CandidateLogin } from './features/auth/components/candidates/candidate-login/candidate-login';
import { CandidateSignup } from './features/auth/components/candidates/candidate-signup/candidate-signup';

export const routes: Routes = [
    {
        path:"",
        component : Candidates,
        children:[
            {path:"login", component : CandidateLogin},
            {path:"signup", component: CandidateSignup},
            {path: "",redirectTo:'login', pathMatch:'full'}
        ]
    }
];
