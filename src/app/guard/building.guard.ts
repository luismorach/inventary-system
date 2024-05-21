import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ComunicatorComponetsService } from '../services/comunicator/comunicator-componets.service';
import { SessionStorageService } from '../storage/session-storage.service';
import { SignUp } from '../interfaces/interfaces';

@Injectable({
    providedIn: 'root'
})
export class BuildingGuard implements CanActivate {
    constructor(private router: Router, 
        private comunicatorSvc: ComunicatorComponetsService,
        private sessionStorageService:SessionStorageService) { }
    canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkBuildingRegistration();
    }
    
    checkBuildingRegistration(): boolean {
        let buildingId = this.sessionStorageService.getItem<SignUp>('user')?.id_building;
        if (buildingId!==null) {
            return true;
        } else {
            this.router.navigateByUrl('/administrador/error');
            this.comunicatorSvc.setNotFound('Debe registrar una empresa primero ' +
                'antes de realizar esta operación, para ello diríjase al apartado de configuraciones, ' +
                'datos de la empresa');
            return false;
        }
    }
}


