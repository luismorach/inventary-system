import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-buscar-compras',
  templateUrl: './buscar-compras.component.html',
  styleUrls: ['./buscar-compras.component.css']
})
export class BuscarComprasComponent extends DinamicComponent {
  formSearchBuys!: FormGroup;
  constructor(private fb: FormBuilder,
    protected override comunicatorSvc: ComunicatorComponetsService,
    protected override router: Router) {
    super(comunicatorSvc, router);
  }
  ngOnInit() {
    this.setTitleAndIcon(3, "fas fa-search-dollar fa-fw")
    this.initForm()
  }
initForm() {
  this.formSearchBuys = this.fb.group({
    initialDate: ['', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
    endDate: ['', [Validators.required,
      Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
    campSearch: ['', [Validators.required, Validators.pattern(/^[a-zA-Z 0-9À-ÿ\u00f1\u00d1]+$/),
      Validators.maxLength(30)]]
  });
}
  checkDates() {
    const initialDateControl = this.formSearchBuys.get('initialDate');
    const endDateControl = this.formSearchBuys.get('endDate');

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
  redirectToComprasRealizadas() {
    const initialDate = this.formSearchBuys.get('initialDate')?.value;
    const endDate = this.formSearchBuys.get('endDate')?.value;

    this.router.navigate(['/administrador/compras/compras realizadas'], { queryParams: { initialDate, endDate } });
  }
  redirectToComprasRealizadasByCriterio() {
    const campSearchValue = this.formSearchBuys.get('campSearch')?.value;
    if (!campSearchValue) return;

    this.router.navigate(['/administrador/compras/compras realizadas'], { queryParams: { criterio: campSearchValue } });
  }
}
