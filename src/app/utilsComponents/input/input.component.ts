import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor,FormControl, FormGroup, NG_VALUE_ACCESSOR, ValidatorFn, } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
 
})

export class InputComponent extends DinamicInput{
  @Input() formGroup!: FormGroup
  @Input() control:string=''
  @Input() labelInfo!: {title:string,required:boolean,type:string};
  
  constructor(protected override comunicatorSvc: ComunicatorComponetsService) {
    super(comunicatorSvc);
  }
  
}
