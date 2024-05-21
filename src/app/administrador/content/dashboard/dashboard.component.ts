import { Component } from '@angular/core';
import { Dashboard, SignUp } from 'src/app/interfaces/interfaces';
import { ActivatedRoute } from '@angular/router';
import { SessionStorageService } from 'src/app/storage/session-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  dashboard!:Dashboard
  names_user!:string |null
  constructor(private route:ActivatedRoute,private sessionStorageService:SessionStorageService){}

  ngOnInit() {
   this.dashboard=this.route.snapshot.data['dashboard'][0]
   console.log(this.dashboard)
    this.names_user=this.sessionStorageService.getItem<SignUp>('user')?.names_user || ''
  }
}
