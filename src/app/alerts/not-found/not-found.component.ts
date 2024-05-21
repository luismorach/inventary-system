import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';
import { Location } from '@angular/common';
import { RouterStateSnapshot } from '@angular/router';
@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotFoundComponent {

  constructor(private comunicatorSvc: ComunicatorComponetsService,
    private ref: ChangeDetectorRef, private location: Location) { }
  message: string = 'Not Found'
  ngOnInit() {
    this.comunicatorSvc.getNotFound().subscribe(res => {
      this.message = res;
      this.ref.detectChanges()
    })
  }
  toBack() {
    this.location.back()

  }
}
