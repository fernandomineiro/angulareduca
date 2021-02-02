

import { Component, OnInit } from '@angular/core';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { ProfessorService } from 'src/app/professor/professor.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';
import { CursosService } from 'src/app/curso/cursos.service';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'underscore';


@Component({
  selector: 'app-criar-conteudo',
  templateUrl: './criar-conteudo.component.html',
  styleUrls: ['./criar-conteudo.component.scss']
})
export class CriarConteudoComponent implements OnInit {
  // status 1 = rascunho
  // status 5 = publicado
  constructor(private criarCursoService: CriarCursoService, private cursosService: CursosService, private formBuilder: FormBuilder, private router: Router, private sanitizer: DomSanitizer, private professorService: ProfessorService) {
    PNotifyButtons;
    if (JSON.parse(localStorage.getItem('user'))) {
      if (JSON.parse(localStorage.getItem('user')).fk_perfil == 14)
        this.router.navigate(['/'])

      this.perfil = JSON.parse(localStorage.getItem('user')).fk_perfil;
    }
  }


  isEdit = false;
  currentCourseId;
  cursos
  imgChanged = false;
  originalTags = []
  objToSend = {}
  submited = false;
  IMG_URL = environment.img_url + '/files/curso/imagem/';
  perfil
  vimeoPluginError = false;
  src
  newRecord: FormGroup;
  professores
  imagem
  checked = false;
  categorias
  categoriasSelecionadas = []
  ngOnInit() {

    this.professorService.get(environment.faculdade_id).subscribe((professores) => {
      this.professores = professores.items;
      this.criarCursoService.getCursosMentoria().subscribe(response => {
        console.log("response", response)
        this.cursos  = response;
      })
    });

    this.cursosService.getCategoriasMentoriaAberta().subscribe(response => {
      this.categorias = response;
    })


    this.newRecord = this.formBuilder.group({
      titulo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      tag: [''],
      teaser: ['', [Validators.required]],
      duracao: ['', [Validators.required]],
      professor: [''],
      categoria: [''],
    })


  }

  salvar(status) {
    this.submited = true;
    if ((status == 'RASCUNHO') || (status == 'PUBLICADO' && this.newRecord.status == 'VALID' && !this.vimeoPluginError && this.originalTags.length) || status == -1) {
      console.log("form", this.newRecord)
      this.objToSend['tags'] = []
      this.objToSend['titulo'] = this.newRecord.get('titulo').value;
      this.objToSend['descricao'] = this.newRecord.get('descricao').value;
      if (this.perfil != 1) {
        this.objToSend['fk_professor'] = Number(this.newRecord.get('professor').value);
      } else {
        this.objToSend['fk_professor'] = JSON.parse(localStorage.getItem('user')).fk_professor;
      }
      this.originalTags.forEach((value,i)=>{
        this.objToSend['tags'].push({nome:value.nome})
      })
      this.objToSend['url_video'] = this.newRecord.get('teaser').value;
      this.objToSend['status'] = status;
      this.objToSend['fk_criador_id'] = JSON.parse(localStorage.getItem('user')).id;
      this.objToSend['duracao_total'] = this.newRecord.get('duracao').value;
      this.objToSend['fk_faculdade'] = environment.faculdade_id;
      this.objToSend['categorias'] = []
      this.categoriasSelecionadas.forEach((value,i)=>{
        this.objToSend['categorias'].push(value.id)
      })
     
      if (status == -1) {
        localStorage.setItem('visualizarPerennials', JSON.stringify(this.objToSend));
        window.open(window.location.href + "/visualizar", '_blank');
      } else {
        console.log(this.objToSend, this.isEdit)
        this.criarCursoService.postCursoMentoria(this.objToSend, this.isEdit, this.currentCourseId).subscribe(response => {
          if (response.success) {
            PNotify.success({
              text: 'Curso criado com sucesso!',
              delay: 3000
            });
            this.limparForm();
          } else {
            PNotify.error({
              text: 'Houve um erro na criação do curso.',
              delay: 3000
            });
          }
          console.log("teste", response)


        });
      }

    }

   
  }




  addTag() {
    if (this.newRecord.get('tag').value && this.newRecord.get('tag').value != ' ')
      this.originalTags.push({ nome: this.newRecord.get('tag').value })
  }

  removeTag(index) {
    this.originalTags.splice(index, 1);
  }
  addCategoria() {
    setTimeout(()=>{
      if (this.newRecord.get('categoria').value && this.newRecord.get('categoria').value != '') {
        if(_.findWhere(this.categoriasSelecionadas, {id:Number(this.newRecord.get('categoria').value)}) == undefined){
          let categoriaNome = _.findWhere(this.categorias, { id: Number(this.newRecord.get('categoria').value) })
          this.categoriasSelecionadas.push({ nome: categoriaNome.nome, id: Number(this.newRecord.get('categoria').value) })

          console.log("teste", this.categoriasSelecionadas)
        }       
      }
    },200)   

  }
  removeCategoria(index) {
    this.categoriasSelecionadas.splice(index, 1);
  }
  getVimeoDuration() {
    $.get('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + this.newRecord.get('teaser').value, (response) => {
      this.vimeoPluginError = false;
      this.checked = true;
      const horas = Math.floor(response.duration / 3600);
      const minutos = Math.floor((response.duration - (horas * 3600)) / 60);
      const segundos = response.duration - (horas * 3600) - (minutos * 60);
      const horass = (horas > 9) ? horas : '0' + horas;
      const minutoss = (minutos > 9) ? minutos : '0' + minutos;
      const ssegundos = (segundos > 9) ? segundos : '0' + segundos;
      const duracao_total = horass + ':' + minutoss + ':' + ssegundos;
      this.newRecord.patchValue({
        duracao: duracao_total
      })
      console.log("duration", this.newRecord.get('duracao').value)
      this.src = 'https://player.vimeo.com/video/' + this.newRecord.get('teaser').value;
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src)
    }).fail((error) => {
      this.vimeoPluginError = true;
      this.checked = true;
      console.log(error);
    });
  }

  loadAndEdit(curso) {
    this.submited = false;
    this.isEdit = true;
    this.vimeoPluginError = false;
    this.checked = false;
      this.newRecord.patchValue({
        titulo: curso.titulo,
        descricao: curso.descricao,
        teaser: curso.url_video,
        professor: curso.fk_professor,
      })
      this.currentCourseId = curso.id
      this.newRecord.patchValue({
        duracao: curso.duracao_total
      })
      this.src = 'https://player.vimeo.com/video/' + this.newRecord.get('teaser').value;
      this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.src)
      this.imagem = curso.imagem;      
      this.originalTags = curso.tags;
      this.categoriasSelecionadas = curso.categorias;  
      this.objToSend['imagem'] = curso.imagem;
      

  }


  onFileSelected(files) {
    const formData = new FormData();
    formData.append('imagem', files[0], files[0].name);
    formData.append('input', 'imagem');
    formData.append('tipo', 'curso');
    this.criarCursoService.uploadFiles(formData).subscribe(response => {
      if (response.success == true) {
        this.objToSend['imagem'] = response.data;
        this.imagem = response.data
      }
    });
  }

  limparForm() {
    this.submited = false;
    this.vimeoPluginError = false;
    this.newRecord.reset();
    this.originalTags = [];
    this.categoriasSelecionadas = []
    this.isEdit = false;
    this.imagem = null;
    this.objToSend = {};
    this.ngOnInit();
    window.scroll(0, 0);
  }

 
  filterStatusPublicado(curso: any) {
    return curso.status == 'PUBLICADO'    
  }

  filterStatusRascunho(curso: any) {
    return curso.status == 'RASCUNHO'    
  }

  excluir(curso){
    this.criarCursoService.deleteCursoMentoria(curso.id).subscribe(response => {
      if (response.success) {
        PNotify.success({
          text: 'Curso excluído com sucesso!',
          delay: 3000
        });
        this.limparForm();
      } else {
        PNotify.error({
          text: 'Houve um erro na exclusão do curso.',
          delay: 3000
        });
      }
    })
  }




}
