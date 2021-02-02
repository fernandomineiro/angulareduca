import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'mt-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {
  IMG_URL = environment.img_url
  constructor() { }

  ngOnInit() {
  }

}
