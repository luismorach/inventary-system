import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-buscar-kardex',
  templateUrl: './buscar-kardex.component.html',
  styleUrls: ['./buscar-kardex.component.css']
})
export class BuscarKardexComponent extends DinamicComponent{
  formSearchKardex!:FormGroup;
  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router) {
    super(comunicatorSvc,router);
  }

  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-search fa-fw")
   this.initDates()
  }
  initDates(){
    this.formSearchKardex=this.fb.group({
      initialDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      endDate:new FormControl('',[Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      campSearch:new FormControl('',[Validators.required,Validators.pattern(/^[0-9]+$/)])
    })
  }
  checkDates() {
    const initialDateControl = this.formSearchKardex.get('initialDate');
    const endDateControl = this.formSearchKardex.get('endDate');

    if (initialDateControl?.invalid) {
      return { isValid: false, msj: 'La fecha inicial es invalida' };
    }

    if (endDateControl?.invalid) {
      return { isValid: false, msj: 'La fecha final es invalida' };
    }

    if (endDateControl?.value <= initialDateControl?.value) {
      return { isValid: false, msj: 'La fecha final debe ser mayor a la inicial' };
    }

    return { isValid: true, msj: '' };
  }

  redirectToKardexByDate() {
    this.router.navigate(['/administrador/kardex/kardex general'],
      {
        queryParams: {
          initialDate: this.formSearchKardex.get('initialDate')?.value,
          endDate: this.formSearchKardex.get('endDate')?.value,
        }
      })
  }

  redirectToKardexByCriterio() {
    this.router.navigate(['/administrador/kardex/kardex general'],
      {
        queryParams: {
          barcode:this.formSearchKardex.get('campSearch')?.value
        }
      })
  }
}
