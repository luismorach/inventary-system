import { Component } from '@angular/core';
import { ComunicatorComponetsService } from '../../services/comunicator/comunicator-componets.service';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/storage/session-storage.service';
import { SignUp } from 'src/app/interfaces/interfaces';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})



export class navBar {
  subMenuAdministracion = false;
  subMenuProductos = false;
  subMenuCompras = false;
  subMenuVentas = false;
  subMenuDevoluciones = false;
  subMenuKardex = false;
  subMenuReportes = false;
  subMenuConfiguraciones = false;
  user!:SignUp
  show!: boolean;
  info: String[]=[];
  
  constructor(private comunicatorSvc: ComunicatorComponetsService,
    private sessionStorageService:SessionStorageService) { }

  ngOnInit() {
    let user=this.sessionStorageService.getItem<SignUp>('user')
    if(user!==null)
      this.user=user
    console.log(user?.id_user)
    this.comunicatorSvc.getShowHideNavBar()
      .pipe(tap(res => this.show = res))
      .subscribe();
  }
 
  showHideNavBar(){
    this.show=!this.show;
    this.comunicatorSvc.setshowHideNavBar(this.show);
  }
  
  changeStyle(active: boolean) {
    const styles = {
      "background-color": active ? "blue" : "transparent",
    }
    return styles;
  }
  arrowStyle(active: boolean) {
    const styles = {
      "transform": active ? "rotate(180deg)" : "none"
    }
    return styles;
  }
}
