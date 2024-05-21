import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
})
export class SuccessComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input () message: Alert={title:'',description:'',showAlert:false,type:'Success'}
  
  cancel() {
    this.messageEvent.emit(false);
  }
 
}
