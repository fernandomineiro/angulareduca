import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { LoginService } from 'src/app/security/login/login.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-perennials',
  templateUrl: './perennials.component.html',
  styleUrls: ['./perennials.component.scss']
})
export class PerennialsComponent implements OnInit {

  constructor(private headerService: HeaderService,public loginService: LoginService,) { }


  ngOnInit() {
     
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

}
