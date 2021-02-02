import { Component, OnInit, HostBinding } from '@angular/core';
import { LoginService } from 'src/app/security/login/login.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CursosService } from 'src/app/curso/cursos.service';
import { HeaderService } from 'src/app/header/header.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { ConfiguracoesStore } from 'src/app/stores/configuracoes.store';
import * as _ from 'underscore';
@Component({
  selector: 'app-aula-live',
  templateUrl: './aula-live.component.html',
  styleUrls: ['./aula-live.component.scss']
})
export class AulaLiveComponent implements OnInit {
  curso
  hasAccess
  cursoId
  modulo
  moduloLiberado
  src
  constructor(
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private cursosService: CursosService,
    private headerService: HeaderService,
    private sanitizer: DomSanitizer,
    private alunoService: AlunoService,
    private configuracoesStore: ConfiguracoesStore,
  ) {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
        state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.headerService.selectedItem.next('user');

    this.cursoId = this.route.snapshot.params['idCurso'];
    this.cursosService.cursoById(this.cursoId)
      .subscribe((ApiResponse) => {
        this.curso = ApiResponse.data;
        this.checkIfUserHasCourse(this.cursoId);
      });
    this.cursosService.getModuloById(this.route.snapshot.params['idModulo']).subscribe((retorno)=>{
      this.modulo = retorno.data[0];
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
      this.checkIfModuloCanBeWatched()
      
    })
  }


  isLoggedIn(): boolean {
    return this.loginService.isLoggedIn()
  }

  checkIfModuloCanBeWatched(){
    if(this.modulo.aula_ao_vivo){
      this.cursosService.getHourFromServer().subscribe((response)=>{
        const resultado = (response as any).retorno;
        if((resultado.data == this.modulo.data_aula_ao_vivo && resultado.hora >= this.modulo.hora_aula_ao_vivo) || (resultado.data > this.modulo.data_aula_ao_vivo)){
          this.moduloLiberado = true;
        }
        else{
          this.moduloLiberado = false;
        }
      });      
    }else{
      this.router.navigate(['/']);
    }  
  }


  checkIfUserHasCourse(cursoId) {
    console.log("curso id", cursoId);
    if (this.curso.tipo == 4) {
      this.cursosService.getCursosRemotosPorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
          var cursosRemotos = ApiResponse.items;
          if (_.findWhere(cursosRemotos, { id: Number(cursoId) }) == undefined)
            this.hasAccess = false;
          else
            this.hasAccess = true;
        }
        )
    }
    else if (this.curso.tipo == 1) {
      this.cursosService.getCursosOnlinePorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
          var cursosOnline = ApiResponse.items;
          if (_.findWhere(cursosOnline, { id: Number(cursoId) }) == undefined)
            this.hasAccess = false;
          else
            this.hasAccess = true;
        }
        )
    }
    else if (this.curso.tipo == 2) {
      this.cursosService.getCursosPresenciaisPorAluno(localStorage.getItem('usuario_id'))
        .subscribe((ApiResponse) => {
          var cursosPresenciais = ApiResponse.items;
          if (_.findWhere(cursosPresenciais, { id: Number(cursoId) }) == undefined)
            this.hasAccess = false;
          else
            this.hasAccess = true;
        }
        )
    }
    if (!this.isLoggedIn())
      this.hasAccess = false;

    else
      this.hasAccess = true;

    console.log("hasAcess", this.hasAccess)
  }

}
