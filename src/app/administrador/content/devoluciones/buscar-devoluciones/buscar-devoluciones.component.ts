import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-buscar-devoluciones',
  templateUrl: './buscar-devoluciones.component.html',
  styleUrls: ['./buscar-devoluciones.component.css']
})
export class BuscarDevolucionesComponent extends DinamicComponent{
  formSearchRepayment!:FormGroup;
  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router) {
    super(comunicatorSvc,router);
  }
  ngOnInit() {
    this.setTitleAndIcon(3,"fas fa-dolly-flatbed fa-fw")
    this.initForm()
  }
  initForm() {
    this.formSearchRepayment = this.fb.group({
      initialDate: ['', [Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      endDate: ['', [Validators.required,
        Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      campSearch: ['', [Validators.required, Validators.pattern(/^[a-zA-Z 0-9À-ÿ\u00f1\u00d1]+$/),
        Validators.maxLength(30)]]
    });
  }
  checkDates() {
    const initialDateControl = this.formSearchRepayment.get('initialDate');
    const endDateControl = this.formSearchRepayment.get('endDate');

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
  redirectToDevolucionesRealizadas() {
    this.router.navigate(['/administrador/devoluciones/devoluciones realizadas'],
      {
        queryParams: {
          initialDate: this.formSearchRepayment.get('initialDate')?.value,
          endDate: this.formSearchRepayment.get('endDate')?.value,
        }
      })
  }
  
  redirectToDevolucionesRealizadasByCriterio() {
    this.router.navigate(['/administrador/devoluciones/devoluciones realizadas'],
      {
        queryParams: {
          criterio:this.formSearchRepayment.get('campSearch')?.value
        }
      })
  }
}
