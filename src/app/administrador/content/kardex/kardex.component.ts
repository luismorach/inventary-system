import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Subscription, tap } from 'rxjs';
import { ComunicatorComponetsService } from 'src/app/services/comunicator/comunicator-componets.service';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KardexComponent {
  comunicatorData!: Subscription
  title: string[] = [];
  constructor(private comunicatorSvc: ComunicatorComponetsService, private ref: ChangeDetectorRef) { }
  ngOnInit() {
    this.comunicatorSvc.getTitleComponent().pipe(tap(res => this.title = res))
      .subscribe(res => { this.ref.detectChanges() });
  }
  ngOnDestroy(){
    (this.comunicatorData)?this.comunicatorData.unsubscribe():null
  }
}
