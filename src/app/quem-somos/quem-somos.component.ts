import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import $ from 'jquery';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';

@Component({
  selector: 'app-quem-somos',
  templateUrl: './quem-somos.component.html',
  styleUrls: ['./quem-somos.component.css']
})
export class QuemSomosComponent implements OnInit {
  configuracoes;
  environmentTemplate = environment;
  constructor(private router: Router, private configuracoesStore: ConfiguracoesStore,
  ) { 
    if(environment.faculdade_id != 7)
      this.router.navigate(['/']);
     this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;
    });
  }

  isMobile:boolean
  

  ngOnInit() {
    this.isMobile = (window.innerWidth < 992) ? true : false;
    
  }

  scrollToElement($element): void {
    console.log($element);
    $('html, body').animate({
      scrollTop: jQuery($element).offset().top - 60
    }, 1000);
    //$element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }


}
