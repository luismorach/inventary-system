import { Component } from '@angular/core';
import {ComunicatorComponetsService}from '../../services/comunicator/comunicator-componets.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent {
  show!:boolean;
  constructor(private comunicatorSvc:ComunicatorComponetsService){}
  
  ngOnInit(){
    this.comunicatorSvc.getShowHideNavBar()
    .pipe(tap(res=>this.show=res))
    .subscribe();
  }
}
