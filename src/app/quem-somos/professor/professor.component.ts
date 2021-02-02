import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';

@Component({
  selector: 'app-QuemSomosProfessorComponent',
  templateUrl: './professor.component.html',
  styleUrls: ['./professor.component.css']
})
export class QuemSomosProfessorComponent implements OnInit {
  configuracoes;
  environmentTemplate = environment;
  constructor(private router: Router,  private configuracoesStore: ConfiguracoesStore) {
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
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

}
