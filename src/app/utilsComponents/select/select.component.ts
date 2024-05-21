import { Component, Input} from '@angular/core';
import { FormBuilder,FormGroup} from '@angular/forms';
import { SelectInfo } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css']
})

export class SelectComponent extends DinamicInput {

  @Input() formGroup!: FormGroup
  @Input() control:string=''
  @Input() selectInfo: SelectInfo= { label: '',optionName:[''],definitionOption:'',required: false };
  @Input() selectOptions!: any[];
  
  constructor(protected override comunicatorSvc: ComunicatorComponetsService,
    private fb: FormBuilder) {
    super(comunicatorSvc);
  }


}