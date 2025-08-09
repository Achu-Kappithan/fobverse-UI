
export interface TableColumn {
  header: string;
  field: string;
  type: 'text' | 'date' | 'status' | 'jobType' | 'number' | 'primary-secondary-text' | 'progress' | 'profile';
}