import { Pipe, PipeTransform } from '@angular/core';
import { UserRole } from '../enums/User-role.enums';

@Pipe({
  name: 'roleDisplay'
})
export class RoleDisplayPipe implements PipeTransform {

  transform(role:UserRole | string): string {
    switch(role){
      case UserRole.CANDIDATE:
        return 'Candidate';
      case UserRole.SUPER_ADMIN:
        return 'Super Admin';
      case UserRole.COMPANY_ADMIN:
        return 'Admin';
      case UserRole.HR_USER:
        return 'HR Executive';
      case UserRole.INTERVIEWER_USER:
        return 'Interviewer';
      default:
        return this.capitalizeWords(role)
    }
  }

  capitalizeWords(str:string):string{
    if (!str) return '';
    return str.split('_')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
  }

}
