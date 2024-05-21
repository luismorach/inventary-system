import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { DinamicInput } from 'src/app/utils/DinamicInput';

@Component({
  selector: 'app-buscar-ventas',
  templateUrl: './buscar-ventas.component.html',
  styleUrls: ['./buscar-ventas.component.css']
})
export class BuscarVentasComponent extends DinamicComponent {
  formSearchSells!: FormGroup;
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
    this.formSearchSells = this.fb.group({
      initialDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      endDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      campSearch: ['', [Validators.required, Validators.pattern(/^[a-zA-Z 0-9À-ÿ\u00f1\u00d1]+$/)]]
    });
  }

  checkDates() {
    const initialDate = this.formSearchSells.get('initialDate');
    const endDate = this.formSearchSells.get('endDate');

    if (initialDate?.invalid) {
      return { isValid: false, msj: 'La fecha inicial es invalida' };
    }

    if (endDate?.invalid) {
      return { isValid: false, msj: 'La fecha final es invalida' };
    }

    if (endDate?.value <= initialDate?.value) {
      return { isValid: false, msj: 'La fecha final debe ser mayor a la inicial' };
    }

    return { isValid: true, msj: '' };
  }

  redirectToVentasRealizadas() {
    const initialDate = this.formSearchSells.get('initialDate')?.value;
    const endDate = this.formSearchSells.get('endDate')?.value;

    this.router.navigate(['/administrador/ventas/ventas realizadas'],
      { queryParams: { initialDate, endDate } });
  }

  redirectToVentasRealizadasByCriterio() {
    const campSearchValue = this.formSearchSells.get('campSearch')?.value;
    if (!campSearchValue) {
      return;
    }
    this.router.navigate(['/administrador/ventas/ventas realizadas'], { queryParams: { criterio: campSearchValue } });
  }

}
