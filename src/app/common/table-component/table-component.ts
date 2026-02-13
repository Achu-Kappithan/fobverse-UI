import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableColumn } from '../../shared/interfaces/table.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClickOutsideDirective } from '../../shared/directives/click-outside';

@Component({
  selector: 'app-table-component',
  imports: [CommonModule,FormsModule,ClickOutsideDirective],
  templateUrl: './table-component.html',
  styleUrl: './table-component.css'
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: unknown[] = [];

  @Output() buttonClicked = new EventEmitter<string>();
  @Output() rowSelected = new EventEmitter<unknown>();
  @Output() dropDownAction = new EventEmitter<{action:string,row:unknown}>();

  selectedRow: unknown | null = null;
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

  ShowDetails(id:string):void{
    this.buttonClicked.emit(id)
  }

  toggleModal(id:string){
    this.activeDropdown = this.activeDropdown == id ? null : id
  }

  opendModal(id:string):boolean{
    return this.activeDropdown === id
  }

  closeModal(){
    this.activeDropdown = null
  }

  selectOption(action: string, row: unknown) {
    this.dropDownAction.emit({ action, row });
    this.activeDropdown = null;
  }


  getRowId(row: unknown): string {
    return (row as Record<string, unknown>)['_id'] as string;
  }

  getRowField(row: unknown, field: string): unknown {
    return (row as Record<string, unknown>)[field];
  }

  getRowFieldAsNumber(row: unknown, field: string): number | null {
    const value = (row as Record<string, unknown>)[field];
    return value as number | null;
  }

  getRowFieldAsDate(row: unknown, field: string): string | Date | null {
    const value = (row as Record<string, unknown>)[field];
    return value as string | Date | null;
  }

  getRowFieldAsString(row: unknown, field: string): string {
    const value = (row as Record<string, unknown>)[field];
    return value as string;
  }

  getRowFieldAsBoolean(row: unknown, field: string): boolean | string {
    const value = (row as Record<string, unknown>)[field];
    return value as boolean | string;
  }
}
