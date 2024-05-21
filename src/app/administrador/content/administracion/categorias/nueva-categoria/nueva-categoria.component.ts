import { ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { CategoriasService } from '../service/categorias.service';
import { Category, ResponseAlert, ValidationResult } from 'src/app/interfaces/interfaces';
import { Subscription } from 'rxjs';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';

@Component({
  selector: 'app-nueva-categoria',
  templateUrl: './nueva-categoria.component.html',
  styleUrls: ['./nueva-categoria.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class NuevaCategoriaComponent extends DinamicComponent {

  formNewCategory!: FormGroup;
  categoryToUpdate!: Category
  subscriptions: Subscription[] = []
  type: string = ''
  
  handleServerResponse = {
    next: (res: any) => {
      this.msj = res
      this.showModal('Success');
      this.clearFormFields()
    }
  }

  constructor(private fb: FormBuilder,
    protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private categoriasSvc: CategoriasService,
    private changeDetertorRef:ChangeDetectorRef) {
    super(comunicatorSvc,router);

  }

  ngOnInit() {
    this.setTitleAndIcon(4,"fa fa-tags fa-fw")
    this.initForm()
    this.setCategory()
    this.subscribeToAlertResponse()
  }
  initForm(){
    this.formNewCategory = this.fb.group({
      name: ['',[Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ 0-9\u00f1\u00d1]+$/),Validators.maxLength(30)]],
      ubication: ['',  [Validators.required,Validators.maxLength(30)]],
    });
  }
  setCategory(){
    if (this.route.snapshot.data['category']) {
      this.categoryToUpdate = this.route.snapshot.data['category'][0]
      this.formNewCategory.get('name')?.setValue(this.categoryToUpdate.name)
      this.formNewCategory.get('ubication')?.setValue(this.categoryToUpdate.ubication)
    }
  }
  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }
  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' && this.type === 'update')
      this.redirectToListCategories()

    if (response.type === 'Warning' && response.response) {
      const action: { [key: string]: any } = {
        create: this.createCategory,
        update: this.updateCategory
      }
      const handler = action[this.type].bind(this)
      handler()
    }
  }

  createCategory() {
    this.categoriasSvc.setCategory(this.formNewCategory.value).subscribe(this.handleServerResponse )
  }

  
  updateCategory() {
    this.categoriasSvc.updateCategory(Number(this.categoryToUpdate.id_category),
      this.formNewCategory.value).subscribe(this.handleServerResponse )
  }

validateUpdate(): ValidationResult {
  let validationResult: ValidationResult = { isValid: true, message: '' };

    const nameValue = this.formNewCategory.get('name')?.value;
    const ubicationValue = this.formNewCategory.get('ubication')?.value;

    if (nameValue === this.categoryToUpdate.name && ubicationValue === this.categoryToUpdate.ubication) {
      validationResult={isValid: false, message: 'No ha modificado los datos' };
    }

    if (this.formNewCategory.invalid) {
      validationResult = { isValid: false, message: 'Existen datos inválidos' };
    }

    return validationResult;
}

  redirectToListCategories() {
    this.router.navigate(['/administrador/administracion/categorías/lista categorías'])
  }

  clearFormFields() {
    this.formNewCategory.reset()
    this.changeDetertorRef.detectChanges()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
