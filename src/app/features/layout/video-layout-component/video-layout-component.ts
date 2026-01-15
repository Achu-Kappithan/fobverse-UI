import { Component } from '@angular/core';
import { ApplicationDetails } from '../../company/components/company-application-layout/application-details/application-details';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-video-layout-component',
  imports: [ApplicationDetails, RouterModule],
  templateUrl: './video-layout-component.html',
  styleUrl: './video-layout-component.css',
})
export class VideoLayoutComponent {

}
