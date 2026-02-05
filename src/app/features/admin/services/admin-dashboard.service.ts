import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../shared/interfaces/api-response.interface';
import { AdminDashboardStats } from '../interfaces/admin-dashboard.interface';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = `/api/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<ApiResponse<AdminDashboardStats>> {
    return this.http.get<ApiResponse<AdminDashboardStats>>(`${this.apiUrl}/dashboard-stats`);
  }
}
