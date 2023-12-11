import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, mergeMap } from 'rxjs';
import { all_coins } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { alert } from 'src/app/interfaces/interfaces';
import { CoinsService } from '../../service/coins.service';

@Component({
  selector: 'app-nueva-moneda',
  templateUrl: './nueva-moneda.component.html',
  styleUrls: ['./nueva-moneda.component.css']
})
export class NuevaMonedaComponent extends DinamicInput{
 
  newCoin!: FormGroup;
  usedClass: string[] = [];
  title!: string[];
  ruta!: string;
  data!: Subscription
  coinToUpdate!:all_coins
  responseServer = {
    next: (res: alert) => {
      this.changeModal(res);
      this.popUp?.nativeElement.showModal();
    },
    error: (error: HttpErrorResponse) => {
      this.error(error);
    }
  }

  @ViewChild('popup', { static: true }) override popUp?: ElementRef;

  constructor(private fb: FormBuilder, private comunicatorSvc: ComunicatorComponetsService,
    public routes: Router, private route: ActivatedRoute, protected override renderer: Renderer2,
    private coinSvc:CoinsService) {
    super();

  }

  ngOnInit() {
    setTimeout(() => {
      this.usedClass[0] = "input-on-focus";
      this.ruta = this.routes.url.slice((this.routes.url.slice(1).lastIndexOf('/')) + 2);
      this.title = []
      if (this.ruta.indexOf("actualizar")) {
        this.title.push("fa-solid fa-cash-register fa-fw");//Aañado el icono del titulo al array
      } else {
        this.ruta = this.routes.url.slice((this.routes.url.slice(1).indexOf('/')) + 2, this.routes.url.lastIndexOf('/'));
        this.title.push("fa fa-arrows-rotate");
      }
      this.title.push(decodeURI(this.ruta).toUpperCase());//añado el titulo al array
      this.comunicatorSvc.setTitleComponent(this.title);
    })

    this.newCoin = this.fb.group({
      country: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      country_code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      language: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      language_code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      currency: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
      currency_code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]),
    })
    if (this.routes.url.includes("actualizar")) {
     /*  const registers = this.route.paramMap.pipe(mergeMap((res: any) => [res]),
        mergeMap((res: any) => this.coinSvc.getRegister(res.params.id_register)))
      this.data = registers.subscribe({
        next: res => {
          if (res instanceof Array) {
            this.newCoin.get('name')?.setValue(res[0].name)
            this.newCoin.get('state')?.setValue(res[0].state)
            this.coinToUpdate = res[0]
          } else {
            this.changeModal(res)
            this.popUp?.nativeElement.showModal()
          }
        },
        error: (error: HttpErrorResponse) => {
          this.error(error)
        }
      }); */
    }
  }
  public error(error: HttpErrorResponse) {
    this.changeModal(this.comunicatorSvc.errorServer(error))
    this.popUp?.nativeElement.showModal()
  }

  submit() {
    
    console.log(this.newCoin.value)
    this.coinSvc.setCoin(this.newCoin.value).subscribe(this.responseServer)
    
  }
  acept() {
    this.popUp?.nativeElement.close();
    if (this.popUp?.nativeElement.children[1].textContent === '¿Estás seguro?') {
      if (this.ruta.indexOf("actualizar")) {
        this.submit()
      } else if (this.popUp?.nativeElement.children[2].textContent.includes('¿desea continuar?')) {
        this.redirectToListRegisters();
      } else {
        this.validarUpdate()
      }
    } else if (this.popUp?.nativeElement.children[1].textContent.includes('Actualizada') &&
      this.ruta.indexOf("nueva")) {
      this.redirectToListRegisters();
    }
  }
  validarUpdate() {
   /*  if (this.newCoin.get('name')?.value === this.coinToUpdate.name &&
      this.newCoin.get('state')?.value === this.coinToUpdate.state) {
      let msj: alert = {
        icon: 'fa-regular fa-circle-question',
        title: '¿Estás seguro?',
        content: 'No ha modificado los datos de la caja ¿desea continuar?'
      }
      this.changeModal(msj)
      this.popUp?.nativeElement.showModal()
    } else {
      this.update()
    } */
  }

  clean() {
    this.newCoin.get('name')?.setValue('');
  }
  update() {
    /* this.cajasSvc.updateRegister(Number(this.coinToUpdate.id_register),
      this.newCoin.value).subscribe(this.responseServer) */
  }

  redirectToListRegisters() {
    this.routes.navigate(['/administracion/lista cajas'])
  }
  ngOnDestroy() {
    if (this.data != undefined)
      this.data.unsubscribe();
  }
}
