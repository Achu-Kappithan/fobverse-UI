import { Pipe, PipeTransform } from '@angular/core';
import { TechLogoData } from '../interfaces/techlogo.interface';

@Pipe({
  name: 'techLogo'
})
export class TechLogoPipe implements PipeTransform {

  transform(techname: string): TechLogoData {
   const lowercase = techname.toLowerCase()

   switch(lowercase){
    case 'html':
    case 'html5':
      return{ type:'image',src:'/techlogo/htmlnew.png',name:techname};
    case 'react':
      return { type: 'image', src: 'techlogo/react.png', name: techname };
    case 'css':
      return { type: 'image', src: 'techlogo/css.png', name: techname };
    case 'javascript':
      return { type: 'image', src: 'techlogo/javascript.png', name: techname };
    case 'angular':
      return {type: 'image', src:'techlogo/angular.png',name:techname}
   }

   const initials = this.getInitials(techname);
   const backgroundColor = this.getDynamicBackgroundColor(techname)
   return {type: 'initials', initials:initials ,backgroundColor:backgroundColor,name:techname}
  }


  private getInitials(tech: string): string {
    if (!tech) return '';
    const words = tech.split(' ');
    if (words.length === 1) {
      return tech.substring(0, 2).toUpperCase();
    }
    return words.map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
  }

  private getDynamicBackgroundColor(tech: string): string {
    let hash = 0;
    for (let i = 0; i < tech.length; i++) {
      hash = tech.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }
  

}
