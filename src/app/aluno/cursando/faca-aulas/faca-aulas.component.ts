import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/curso/cursos.service';
import { HeaderService } from 'src/app/header/header.service';
import { ActivatedRoute } from '@angular/router';
import { AlunoService } from 'src/app/aluno/aluno.service';
import * as underscore from 'underscore';
import { Router } from '@angular/router';
import {LoginService} from '../../../security/login/login.service';
import {environment} from '../../../../environments/environment';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';
import * as _ from 'underscore';


@Component({
  selector: 'app-faca-aulas',
  templateUrl: './faca-aulas.component.html',
  styleUrls: ['./faca-aulas.component.css']
})
export class FacaAulasComponent implements OnInit {

  constructor(
    private cursosService: CursosService,
    private alunoService: AlunoService,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private configuracoesStore: ConfiguracoesStore,
  ) { }

  curso: any;
    // tslint:disable-next-line:variable-name
  nome_curso: string;
    // tslint:disable-next-line:variable-name
  nome_curso_flag: boolean;
  modulos: any;
    // tslint:disable-next-line:variable-name
  percentual_conclusao: 0;
  panelOpenState = [];
  assistidos: any;

  certificado;
  existeCertificado = false;
  certificados;
  progresso: any = {};
  krotonAccess: any = false;

  openWhere = 0

  PDF_URL = environment.img_url + '/files/certificado/emitidos/';

  reload = false;

  ngOnInit() {
        if (localStorage.getItem('krotonAccess') == 'Sim') {
          this.krotonAccess = true;
        }
        this.route.parent.paramMap.subscribe(params => {

          this.cursosService.cursoById(params.get('id'))
              .subscribe((ApiResponse) => {
                  this.curso = ApiResponse.data;
                  this.nome_curso = ApiResponse.data['nome_curso'];
                  this.nome_curso_flag = true;
                  this.curso.id = params.get('id');
                  if (this.curso.tipo == 2) {
                    this.router.navigate(['/']);
                  }

                  this.alunoService
                    .getProgressoConclusao(
                        Number(localStorage.getItem('usuario_id')),
                        Number(params.get('id'))
                    ).subscribe((APIResponse) => {
                        this.progresso = APIResponse;
                        console.log('progresso', APIResponse);
                    });

                  // verifica se o curso possui certificado antes de mandar emitir
                  if (this.curso.emite_certificado) {
                      this.emiteCertificado(Number(params.get('id')));
                  }

                  if (localStorage.getItem('krotonAccess') != 'Sim') {

                      this.alunoService
                          .getCertificadosDisponiveis(Number(localStorage.getItem('usuario_id')))
                          .subscribe((certificados) => {
                              this.certificados = certificados.items;
                              this.certificados.forEach((value, i) => {
                                  if(value.fk_curso == this.curso.id) {
                                      this.existeCertificado = true;
                                      this.certificado = value;
                                  }
                              });
                          });
                  }
              });

          if (this.loginService.membership && this.loginService.membership.type && this.loginService.membership.type[0]) {
              const data = {
                  faculdade: environment.faculdade_id ,
                  aluno: Number(localStorage.getItem('usuario_id')),
                  pedido: this.loginService.membership.type[0].id
              };
              this.cursosService.adicionaModulosPorCurso(params.get('id'), data).subscribe(apiResponse => {
                  console.log(apiResponse, 'adicionarModulosPorCurso');
              });
          }

          this.configuracoesStore.state$.subscribe(state => {
              if (state.configuracao.layoutHome == 1) {
                  const data = {
                      faculdade: environment.faculdade_id ,
                      aluno: Number(localStorage.getItem('usuario_id')),
                      pedido: 0
                  };
                  this.cursosService.adicionaModulosPorCurso(params.get('id'), data).subscribe(apiResponse => {
                      console.log(apiResponse, 'adicionarModulosPorCurso');
                  });
                  this.emiteCertificado(Number(params.get('id')));
              }
          });

          this.cursosService.modulosByCursoId(params.get('id'))
            .subscribe((apiResponse) => {
              this.modulos = apiResponse.items;
              console.log('param', params.get('id'));
              this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(params.get('id')))
                .subscribe((apiResponseModulos) => {
                  this.assistidos = apiResponseModulos.items;
                  this.modulos.forEach((value,i)=>{
                      let index = _.findIndex(value.modulos, {modulo_id : this.assistidos[this.assistidos.length-1]})
                    if(index != -1){
                        console.log("entrei")                       
                        this.openWhere = value.modulos[index+1] ? i : i+1;
                    }
                })
                    console.log("openWhere", this.openWhere)
                  console.log('assistidos', apiResponseModulos);

                });
            });
    });

  }

  emiteCertificado(id) {
      this.alunoService
          .emiteCertificado(
              Number(localStorage.getItem('usuario_id')),
              Number(id)
          ).subscribe((APIResponse) => {
              console.log('resultado', APIResponse);
          });
  }

  reloadParent() {
    this.route.parent.paramMap.subscribe(params => {
        this.alunoService.getModulosCompletos(Number(localStorage.getItem('usuario_id')), Number(params.get('id')))
            .subscribe((apiResponseModulos) => {
                this.assistidos = apiResponseModulos.items;
                console.log('assistidos', apiResponseModulos);
                this.reload = true;
            });
    });
  }

}
