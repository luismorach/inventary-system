import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { tap, finalize, first } from 'rxjs';
import { UsuariosService } from 'src/app/administrador/content/administracion/usuarios/service/usuarios.service';
import { EmpresaService } from 'src/app/administrador/content/configuraciones/service/empresa.service';
import { User, SignUp } from 'src/app/interfaces/interfaces';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { DinamicComponent } from 'src/app/utils/DinamicComponent';
import { AuthService } from '../service/auth.service';
import { SessionStorageService } from 'src/app/storage/session-storage.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends DinamicComponent {
  formLogin!: FormGroup
  formRecover!: FormGroup
  logging = false
  sendingEmail = false
  textButton = 'Iniciar sesión'
  textBtnRecoverPassword = 'ACEPTAR'
  @ViewChild('recoverPassword') recoverPasswordModal?: ElementRef;
  constructor(private fb: FormBuilder,
    protected comunicatorService: ComunicatorComponetsService,
    protected override router: Router,
    public authService: AuthService,
    private sesionStorage:SessionStorageService) {
    super(comunicatorService, router);

  }
  ngOnInit() {
    this.initForm()
  }
  initForm() {
    this.formLogin = this.fb.group({
      document_type_user: ['V-', [Validators.required]],
      document_number_user: ['', [Validators.required]],
      password_user: ['', [Validators.required]],
    });
    this.formRecover = this.fb.group({
      document_type_recover: ['V-', [Validators.required]],
      document_number_recover: ['', [Validators.required]],
    });
  }


  login() {
    this.textButton = 'Iniciando sesión...'
    this.logging = true
    const user: User = this.formLogin.value;
    this.authService.auth(user).pipe(
      tap((res: any) => {
        this.sesionStorage.setItem('user',res)
        this.redirectToAdminOrCashier(res.range_user);
      }),
      finalize(() => {
        this.textButton = 'Iniciar sesión'
        this.logging = false
        this.cleanFormLogin();
      })).subscribe();
  }

  openRecoverPasswordModal() {
    this.recoverPasswordModal?.nativeElement.showModal()
  }
  closeModal() {
    this.recoverPasswordModal?.nativeElement.close()
  }

  forgotPassword() {
    this.textBtnRecoverPassword = 'ENVIANDO CORREO...'
    this.sendingEmail = true
    this.authService.forgotPassword(this.formRecover.value).pipe(
      finalize(() => {
        this.textBtnRecoverPassword = 'ACEPTAR'
        this.sendingEmail = false
      })
    ).subscribe(res => {
      this.msj = res
      this.showModal('Success')
      this.cleanFormRecoverPassword()
    })
  }



  redirectToAdminOrCashier(userRole: string) {
    console.log(userRole)
    if (userRole === 'Administrador') {
      this.router.navigate(['/administrador/dashboard']);
    } else {
      this.router.navigate(['/cajero/nueva venta']);
    }
  }
  cleanFormLogin() {
    this.formLogin.get('documentType')?.setValue('V-')
    this.formLogin.get('documentNumber')?.setValue('')
    this.formLogin.get('password')?.setValue('')
  }
  cleanFormRecoverPassword() {
    this.closeModal()
    this.formRecover.get('documentType')?.setValue('V-')
    this.formRecover.get('documentNumber')?.setValue('')
  }


}
