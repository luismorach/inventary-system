import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Alert } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-quantity',
  templateUrl: './quantity.component.html',
  styleUrls: ['./quantity.component.css']
})
export class QuantityComponent extends DinamicInput{
  @Output() messageEvent = new EventEmitter<boolean | number>();
  @Input () message:Alert={title:'',description:'',showAlert:false,type:'Error'};
  quantityForm!:FormGroup

  constructor( private fb:FormBuilder,protected override comunicatorSvc: ComunicatorComponetsService){
    super(comunicatorSvc)
  }

  ngOnInit(){
   this.initForm()
  }
initForm(): void {
  this.quantityForm = this.fb.group({
    quantity: ['',Validators.pattern(/^[0-9.]+$/)]
  });
}
  
  accept() {
    this.messageEvent.emit(Number(this.quantityForm.get('quantity')?.value));
    this.quantityForm.get('quantity')?.setValue('')
  }
  cancel() {
    this.messageEvent.emit(false);
    this.quantityForm.get('quantity')?.setValue('')
  }
}
