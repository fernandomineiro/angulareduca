import { Component, OnInit} from '@angular/core';
import { LoadingScreenService } from './loading-screen.service';
import { Subscription } from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
    selector: 'app-loading-screen',
    templateUrl: './loading-screen.component.html',
    styleUrls: ['./loading-screen.component.css']
})
export class LoadingScreenComponent implements OnInit {

    loading: boolean = false;
    loadingSubscription = Subscription;

    constructor(
        private loadingScreenService: LoadingScreenService
    ) {

    }

    ngOnInit(): void {
        this.loadingScreenService.loadingStatus.subscribe((value) => {
            this.loading = value;
        });
    }
}
