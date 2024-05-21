import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ResponseAlert, Clock, User, AlertPay, SignUp } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicInput } from 'src/app/utils/DinamicInput';
import { Subscription, take, tap } from 'rxjs';
import { ClockService } from '../services/clock/clock.service';
import { UsuariosService } from '../administrador/content/administracion/usuarios/service/usuarios.service';
import { SessionStorageService } from '../storage/session-storage.service';

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css']
})
export class CashierComponent extends DinamicInput {

  date = new Date()
  subscriptions: Subscription[] = []
  clock!: Clock
  name_register!: string | undefined
  account!: User
  formTicket!: FormGroup
  operation!: string
  @ViewChild('user', { static: true }) userModal?: ElementRef;
  @ViewChild('modalTicketVenta', { static: true }) modalTicket?: ElementRef;
  @ViewChild('pay') payment?: ElementRef;

  constructor(
    private router: Router,
    public comunicatorService: ComunicatorComponetsService,
    private changeDetectorRef: ChangeDetectorRef,
    private clockService: ClockService,
    private userService: UsuariosService,
    private sessionStorageService:SessionStorageService) {
    super(comunicatorService);
  }
  ngOnInit() {

    // Decode the URI to get the operation from the router URL
    this.operation = decodeURI(this.router.url.split('/')[2]);
    this.initForm()
    this.setAccountInfo()
    this.getInfoAlertPay()
    this.getClockInfo()
  }
  initForm(){
    this.formTicket = new FormGroup({
      ticketNumber: new FormControl('')
    });
  }

  setAccountInfo() {
    this.name_register= this.sessionStorageService.getItem<SignUp>('user')?.name_register
    const userId = this.sessionStorageService.getItem<SignUp>('user')?.id_user;
    if (userId) {
      this.subscriptions.push(
        this.userService.getUser(Number(userId)).pipe(take(1)).subscribe((userAccounts: User[]) => {
          this.account = userAccounts[0];
        })
      );
    }
  }

  getClockInfo() {
    this.subscriptions.push(
      this.clockService.getClockInfo().pipe(tap(clockInfo => {
        this.clock = clockInfo;
      })).subscribe(() => {
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  getInfoAlertPay() {
    this.subscriptions.push(
      this.comunicatorService.getInfoAlertPay().subscribe((alert: AlertPay) => {
        if (alert && alert.showAlert) {
          this.msjPay = alert;
          this.payment?.nativeElement.showModal();
        } else {
          this.payment?.nativeElement.close();
        }
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  open(alert: ElementRef | undefined) {
    alert?.nativeElement.showModal()
  }

  close() {
    this.router.navigateByUrl('/login')
    sessionStorage.clear()
  }

  closeModal(alert: ElementRef | undefined) {
    alert?.nativeElement.close()
  }

  receiveMessagePay(response: any) {
    let responseAlert: ResponseAlert = {
      type: 'pay',
      response: response
    }
    this.comunicatorSvc.setResponseAlert(responseAlert)
    if (!(response instanceof Object)) {
      this.msjPay.showAlert = false
      this.comunicatorSvc.setInfoAlertPay(this.msjPay)
    }
  }

  validateOpenModalTicket() {
    if (this.operation !== decodeURI(this.router.url.split('/')[2])) {
      this.open(this.modalTicket)
    }
  }

  redirectToDetallesVenta() {
    this.router.navigateByUrl('/cajero/detalles venta/' + this.formTicket.get('ticketNumber')?.value)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}


