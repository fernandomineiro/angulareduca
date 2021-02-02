import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import * as _ from 'underscore';
import { CursosService } from 'src/app/curso/cursos.service';
import { ADDRESS_API } from '../../app.api';
// @ts-ignore
import $ from 'jquery';
import { Router } from '@angular/router';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { ModalAvisoService } from 'src/app/header/modal-aviso/modal-aviso.service';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
// @ts-ignore
declare var $: $;


@Component({
  selector: 'app-modulos-list',
  templateUrl: './modulos-list.component.html',
  styleUrls: ['./modulos-list.component.css']
})
export class ModulosListComponent implements OnInit {

  constructor(
    private cursosService: CursosService, private router: Router, private alunoService: AlunoService,  private modalWarning: ModalAvisoService,) { }

  @Input()
  modulos: any

  @Input()
  curso: any;

  @Input()
  assistidos: any;

  @Input()
  openWhere: any;

  @Input()
  hasAccess: any;

  @Input()
  reload: any

  panelOpenState = []

  @Output("reloadParent") 
  reloadParent: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    console.log("hasAccess",this.hasAccess)
    console.log("aqui", this.modulos, this.assistidos, this.curso);
    let amountAoVivo = 0
    this.modulos.forEach((element, i) => {
      amountAoVivo += _.where(element.modulos, { aula_ao_vivo: 1 }).length
    });
    let allSemAoVivo = []
    console.log('ao vivo', amountAoVivo)
    this.modulos.forEach((element, i) => {     
      this.panelOpenState.push(this.openWhere == i || this.openWhere == 'all');    
      element.modulos.forEach((element2, i2) => {       
        element2.liberado = true;
        if (this.assistidos.includes(element2.modulo_id)) {
          element2.assistido = true;
        }
        if (!element2.aula_ao_vivo) {
          allSemAoVivo.push(element2);
        }else{
          this.cursosService.getHourFromServer().subscribe((response) => {
            const resultado = (response as any).retorno;
            if ((resultado.data == element2.data_aula_ao_vivo && resultado.hora >= element2.hora_aula_ao_vivo) || (resultado.data > element2.data_aula_ao_vivo)) {                      
              element2.liberado = true;    
            }else{
              element2.liberado = false;
            }
          })
        } 
         
        
      
      });
      element.amountWatched = _.where(element.modulos, { assistido: true }).length;
    });
    allSemAoVivo.forEach((el, i) => {
      if (i > 0) {
        if (!allSemAoVivo[i - 1].assistido) {
          el.liberado = false;
        }
      }
    })
    console.log("modulos", this.modulos);


  }

  getHourFromServer() {
    $.get(`${ADDRESS_API}/api/get-hour-from-server`, function (response) {
      const resultado = response.retorno;
      console.log('data: ' + resultado.data + ' | hora: ' + resultado.hora);
      return resultado;
    });
  }

 
  redirect(modulo) {
    if (modulo.aula_ao_vivo) {
      this.cursosService.getHourFromServer().subscribe((response) => {
        const resultado = (response as any).retorno;
        if ((resultado.data == modulo.data_aula_ao_vivo && resultado.hora >= modulo.hora_aula_ao_vivo) || (resultado.data > modulo.data_aula_ao_vivo)) {
          this.alunoService.setModuleComplete({
            'fk_modulo': modulo.modulo_id,
            'fk_usuario': Number(localStorage.getItem('usuario_id')),
            'id_curso': this.curso.id
          }).subscribe(response => {
            this.reloadParent.emit();
            var interval = setInterval(()=>{
              if(this.reload){
                this.ngOnInit();
                clearInterval(interval);
              }
            },500);           
            window.open(modulo.link_aula_ao_vivo, '_blank');            
          })
        }else{
          this.modalWarning.openWarning('Esta aula ainda não começou');
        }
      })
    } else {
      this.router.navigate(['/video/', this.curso.id, modulo.modulo_id])
    }
  }


}
