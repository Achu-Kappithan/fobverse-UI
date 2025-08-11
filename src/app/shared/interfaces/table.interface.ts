
export interface TableColumn {
  header: string;
  field: string;
  type: 'text' | 'date' | 'status' | 'jobType' | 'number' | 'progress' | 'profile'|'dropdown';
  options?: { label: string; action: string }[]
}