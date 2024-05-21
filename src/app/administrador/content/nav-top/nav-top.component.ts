import { Component } from '@angular/core';
import { ComunicatorComponetsService } from '../../../services/comunicator/comunicator-componets.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/storage/session-storage.service';
import { SignUp } from 'src/app/interfaces/interfaces';
@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.css']
})
export class NavTopComponent {
  id_user!:number
  show!: boolean;
  constructor(private comunicatorSvc: ComunicatorComponetsService, public routes: Router,
    private sessionStorageService:SessionStorageService
  ) { }

  ngOnInit() {
    this.id_user= Number(this.sessionStorageService.getItem<SignUp>('user')?.id_user)
    this.comunicatorSvc.getShowHideNavBar()
      .subscribe(res => this.show = res);
  }

  showHideNavBar() {
    this.show = !this.show;
    this.comunicatorSvc.setshowHideNavBar(this.show);
  }
  close() {
    this.routes.navigateByUrl('/login')
    sessionStorage.clear()
  }
}
