import { Injectable } from '@angular/core';
import { Observable, Subject, map, shareReplay, timer } from 'rxjs';
import { Clock } from 'src/app/interfaces/interfaces';


@Injectable({
    providedIn: 'root'
})

export class ClockService {
    private clock$: Observable<Date>
    private infoClock$: Subject<Clock> = new Subject<Clock>;
    constructor() {
        this.clock$ = timer(0, 1000).pipe(map(() => new Date()), shareReplay(1))
    }
    getClockInfo() {
        this.clock$.subscribe(time => {
            const clockInfo: Clock = {
                hour: (time.getHours() % 12) ? (time.getHours() % 12) : 12,
                minutes: (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes().toString(),
                seconds: (time.getSeconds() < 10) ? '0' + time.getSeconds() : time.getSeconds().toString(),
                period: (time.getHours() > 11) ? 'PM' : 'AM'
            };
            this.infoClock$.next(clockInfo);
        });
        return this.infoClock$.asObservable();
    }

}
