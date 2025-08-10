import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TableColumn } from '../../../../../shared/interfaces/table.interface';
import { TableComponent } from '../../../../../common/table-component/table-component';
import { Router, RouterModule } from '@angular/router';

export interface Job {
  id: number;
  title: string;
  location: string;
  status: 'active' | 'inactive' | 'draft' | 'expired';
  postedDate: string;
  dueDate: string;
  jobType: 'fulltime' | 'parttime' | 'remote' | 'onsite';
  applications: number;
  vacancies: number;
  applicationProgress: number;
  selected?: boolean;
}

@Component({
  selector: 'app-jobs-list',
  imports: [CommonModule, FormsModule, TableComponent, RouterModule],
  templateUrl: './jobs-list.html',
  styleUrl: './jobs-list.css',
})
export class JobsList {
  constructor(private readonly _router: Router) {}

  jobs: Job[] = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA',
      status: 'active',
      postedDate: 'Nov 15, 2024',
      dueDate: 'Dec 15, 2024',
      jobType: 'fulltime',
      applications: 42,
      vacancies: 3,
      applicationProgress: 75,
      selected: false,
    },
    {
      id: 2,
      title: 'DevOps Engineer',
      location: 'Seattle, WA',
      status: 'active',
      postedDate: 'Nov 18, 2024',
      dueDate: 'Dec 18, 2024',
      jobType: 'onsite',
      applications: 23,
      vacancies: 2,
      applicationProgress: 45,
      selected: false,
    },
    {
      id: 3,
      title: 'Product Manager',
      location: 'Los Angeles, CA',
      status: 'inactive',
      postedDate: 'Nov 10, 2024',
      dueDate: 'Dec 10, 2024',
      jobType: 'fulltime',
      applications: 8,
      vacancies: 1,
      applicationProgress: 15,
      selected: false,
    },
    {
      id: 4,
      title: 'UX Designer',
      location: 'Remote',
      status: 'draft',
      postedDate: 'Nov 12, 2024',
      dueDate: 'Dec 12, 2024',
      jobType: 'remote',
      applications: 15,
      vacancies: 2,
      applicationProgress: 30,
      selected: false,
    },
    {
      id: 5,
      title: 'Backend Developer',
      location: 'Austin, TX',
      status: 'expired',
      postedDate: 'Oct 25, 2024',
      dueDate: 'Nov 25, 2024',
      jobType: 'parttime',
      applications: 5,
      vacancies: 1,
      applicationProgress: 10,
      selected: false,
    },
    {
      id: 6,
      title: 'Data Scientist',
      location: 'Boston, MA',
      status: 'active',
      postedDate: 'Nov 20, 2024',
      dueDate: 'Dec 20, 2024',
      jobType: 'fulltime',
      applications: 31,
      vacancies: 2,
      applicationProgress: 60,
      selected: false,
    },
    {
      id: 7,
      title: 'Mobile Developer',
      location: 'New York, NY',
      status: 'active',
      postedDate: 'Nov 16, 2024',
      dueDate: 'Dec 16, 2024',
      jobType: 'remote',
      applications: 28,
      vacancies: 1,
      applicationProgress: 55,
      selected: false,
    },
    {
      id: 8,
      title: 'QA Engineer',
      location: 'Chicago, IL',
      status: 'draft',
      postedDate: 'Nov 14, 2024',
      dueDate: 'Dec 14, 2024',
      jobType: 'onsite',
      applications: 12,
      vacancies: 2,
      applicationProgress: 25,
      selected: false,
    },
  ];

  public tablecolumns: TableColumn[] = [
    { header: 'Role', field: 'title', type: 'text' },
    { header: 'status', field: 'status', type: 'status' },
    { header: 'Postdate', field: 'postedDate', type: 'date' },
    { header: 'dueDate', field: 'dueDate', type: 'date' },
    { header: 'jobType', field: 'jobType', type: 'jobType' },
    { header: 'Applications', field: 'applications', type: 'progress' },
    { header: 'vacancies', field: 'vacancies', type: 'number' },
    { header: 'Action', field: 'viewjob', type: 'profile' },
  ];

  onRowSelected(row: any): void {
    console.log('Row selected:', row);
  }

  showJobDetails() {
    this._router.navigate(['company/home']);
  }
}
