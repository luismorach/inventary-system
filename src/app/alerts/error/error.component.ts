import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Alert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class ErrorComponent {
  @Output() messageEvent = new EventEmitter<boolean>();
  @Input () message:Alert={title:'',description:'',showAlert:false,type:'Error'};
  
  constructor(private comunicatorSvc: ComunicatorComponetsService,private ref:ChangeDetectorRef){
  }
  
  accept() {
    this.messageEvent.emit(true);
  }
  cancel() {
    this.messageEvent.emit(false);
  }
}
