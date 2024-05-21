import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, ResponseAlert} from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { AuthService } from '../service/auth.service';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends DinamicComponent {
  formNewUser!: FormGroup;
  subscriptions: Subscription[] = []
  textBtn="CONTINUAR"
  changingPassword=false

  constructor(private fb: FormBuilder,
    protected override router: Router,
    protected override comunicatorSvc: ComunicatorComponetsService,
    private route: ActivatedRoute,
    private authSvc: AuthService) {
    super(comunicatorSvc, router);
  }
  
  ngOnInit() {
    this.initForm()
    this.subscribeToAlertResponse()
  }

  initForm() {
    this.formNewUser = this.fb.group({
     
      password_user: ['', [Validators.required,Validators.maxLength(20)]],
      repeat_password_user: ['', [Validators.required,Validators.maxLength(20)]],
    })
    this.formNewUser.get('repeat_password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'password_user'),Validators.required,Validators.maxLength(20)])
    this.formNewUser.get('password_user')?.setValidators(
      [this.equalsValidator(this.formNewUser, 'repeat_password_user'),Validators.required,Validators.maxLength(20)])

  }

  changePassword(){
    this.textBtn="PROCESANDO..."
    this.changingPassword=true
    const token=this.route.snapshot.params['token']
    this.authSvc.changePassword(token,this.formNewUser.controls['password_user'].value)
    .pipe(
      finalize(()=>{
        this.textBtn="CONTINUAR"
        this.changingPassword=false
      })
    ).subscribe(res=>{
      this.msj=res
      this.showModal('Success')
    })
  }

  subscribeToAlertResponse() {
    this.subscriptions.push(
      this.comunicatorSvc.getResponseAlert().subscribe(response => this.handleAlertResponse(response))
    );
  }

  handleAlertResponse(response: ResponseAlert) {
    if (response.type === 'Success' )
      this.redirectToLogin()
  }

  redirectToLogin() {
    this.router.navigate(['/login'])
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => (subscription) ? subscription.unsubscribe() : null)
  }
}
