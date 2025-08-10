import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../shared/interfaces/table.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table-component',
  imports: [CommonModule,FormsModule],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];

  @Output() buttonClicked = new EventEmitter<{ id: string }>();

  @Output() rowSelected = new EventEmitter<any>()
  selectedRow: any = null

  activeDropdown: string | null = null;


  getStatusClass(status: boolean| string): string {
    if (status === true || status === 'true') {
    return 'bg-green-100 text-green-700 text-xs font-medium rounded-full';
    }
    if (status === false || status === 'false') {
      return 'bg-red-100 text-red-700 text-xs font-medium rounded-full';
    }
    return '';
  }
  

  getJobTypeClass(type:string):string{
    switch (type?.toLowerCase()) {
      case 'fulltime':
      case 'open':
        return 'bg-blue-100 text-blue-700 text-xs font-medium rounded-full';
      case 'onsite':
      case 'closed':
        return 'bg-rose-100 text-rose-700 text-xs font-medium rounded-full';
      case 'remote':
        return 'bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full';
      case 'parttime':
        return 'bg-orange-100 text-orange-700 text-xs font-medium rounded-full';
      default:
        return '';
    }
  }

  ShowDetails():void{
    this.buttonClicked.emit()
  }

}
