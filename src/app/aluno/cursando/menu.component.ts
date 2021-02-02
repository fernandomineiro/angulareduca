import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { Curso } from '../../curso/curso.model';
import { CursosService } from '../../curso/cursos.service';

import { Categoria } from '../../categorias/categorias.model';
import { CategoriasService } from '../../categorias/categorias.service';

import { Observable, from } from 'rxjs';
import { switchMap, tap, debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { HeaderService } from 'src/app/header/header.service';
import { Input } from '@angular/core';
import $ from 'jquery';
import {NotificationService} from '../../shared/messages/notification.service';
import { AlunoService } from 'src/app/aluno/aluno.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'mt-cursando-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})

export class CursandoMenuComponent implements OnInit {

  curso: any;
  selectedFile: File;
  fileName: string;
  cursoId: string;
  isPresencial: any;
  enviados: any;
  uploaded: boolean = false;
  progresso
  IMG_URL = environment.img_url;
  respondeDuvidas: boolean = true;

  @Input()
  showVoucher;

  @Input()
  showDuvidas;

  @Input()
  showQuiz;

  @Input()
  showAulas;

  @Input()
  current: any;

  constructor(private cursosService: CursosService, 
              private categoriasService: CategoriasService, 
              private router: Router,              
              private route: ActivatedRoute,
              private ns: NotificationService,
              private alunoService: AlunoService
  ) { }

  ngOnInit() {   
    this.route.parent.paramMap.subscribe(params => {

      this.cursosService.cursoById(params.get('idCurso'))
      this.cursoId = params.get('id');
      this.getTrabalhosEnviados(this.cursoId)
      this.cursosService.cursoById(params.get('id'))
          .subscribe((ApiResponse) => {
            this.curso = ApiResponse.data;
            if (this.curso.tipo == 2) {
              this.isPresencial = true;
            }
            if(this.curso.professor_responde_duvidas === 0){
              //this.showDuvidas = true;
              this.respondeDuvidas = false;
            }else{
              this.respondeDuvidas = true;
            }
      });
      this.alunoService.getProgressoConclusao(Number(localStorage.getItem('usuario_id')),Number(params.get('id'))).subscribe((APIResponse)=>{
        this.progresso = APIResponse;
      });
    });

 
  }

  getTrabalhosEnviados(idCurso) {
    this.alunoService.getTrabalhosEnviados(Number(localStorage.getItem('usuario_id')), Number(idCurso)).subscribe((response) => {
      this.enviados = response.items;
      if (this.enviados && this.enviados.length > 0) this.uploaded = true;
      else this.uploaded = false;
    });
  }

  inserirNoCarrinho(item) {
    const categoria = 'Curso Presencial';
    this.router.navigate(['/carrinho']);
  }

  clickUpload() {
    $('#upload').click();
  }

  uploadChange(event) {
    this.selectedFile = event.target.files[0];
    this.fileName = this.selectedFile.name;
  }

  getArquivoName(trabalho) {
    if (trabalho.filename) {
      return trabalho.filename;
    }

    const nomeArquivo = trabalho.downloadPath.split('/');

    return nomeArquivo[nomeArquivo.length - 1];
  }

  uploadTcc() {
    this.cursosService.uploadTcc(this.selectedFile, this.cursoId, localStorage.getItem('usuario_id')).subscribe((uploadResponse) => {
      this.getTrabalhosEnviados(this.cursoId);
      $(document.body).removeClass('modal-open');
      $('#tccModal .close').click();
      $('#openTccSuccess').click();
    });
  }
}
