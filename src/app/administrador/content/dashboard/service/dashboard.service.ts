import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Dashboard } from 'src/app/interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DashboardService{
  private apiURL = 'http://localhost:3000/dashboard';

  constructor(private http: HttpClient) { }
  
  public getData(): Observable<Dashboard[]> {
    return this.http.get<Dashboard[]>(this.apiURL);
  }
}





