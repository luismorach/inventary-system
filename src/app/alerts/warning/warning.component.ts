import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.css']
})
export class WarningComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input () message: Alert={title:'',description:'',showAlert:false,type:'Success'}
  
  
  accept() {
    this.messageEvent.emit(true);
  }
  cancel() {
    this.messageEvent.emit(false);
  }
}
