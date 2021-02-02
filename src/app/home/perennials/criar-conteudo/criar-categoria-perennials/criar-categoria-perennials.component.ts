import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Validators, FormBuilder } from '@angular/forms';
import { CursosService } from 'src/app/curso/cursos.service';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons';
import PNotify from 'pnotify/dist/es/PNotify';

@Component({
  selector: 'app-criar-categoria-perennials',
  templateUrl: './criar-categoria-perennials.component.html',
  styleUrls: ['./criar-categoria-perennials.component.scss']
})
export class CriarCategoriaPerennialsComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private cursosService: CursosService) { }
  newRecord: FormGroup;
  submited = false;
  objToSend = {}
  categorias
  isEdit = false
  loadedCategoria
  ngOnInit() {

    this.newRecord = this.formBuilder.group({
      nome: ['', [Validators.required]],
      descricao: ['', [Validators.required]]
    })

    this.loadCategorias();
  }

  salvar() {
    this.submited = true;
    if (this.newRecord.status == 'VALID') {
      this.objToSend['nome'] = this.newRecord.get('nome').value;
      this.objToSend['descricao'] = this.newRecord.get('descricao').value;
      this.objToSend['fk_criador_id'] = JSON.parse(localStorage.getItem('user')).id;
      if (!this.isEdit) {
        this.cursosService.postCategoriaMentoria(this.objToSend).subscribe(response => {
          if ((response as any).success) {
            PNotify.success({
              text: 'Categoria criada com sucesso!',
              delay: 3000
            });
            this.limparForm();
          }

        })
      } else {
        this.cursosService.putCategoriaMentoria(this.objToSend, this.loadedCategoria.id).subscribe(response => {
          if ((response as any).success) {
            PNotify.success({
              text: 'Categoria atualizada com sucesso!',
              delay: 3000
            });
            this.limparForm();
          }
        })
      }
    }
  }

  loadCategorias() {
    this.cursosService.getCategoriasMentoria().subscribe(response => {
      this.categorias = response;
    })
  }

  editar(categoria) {
    this.isEdit = true;
    this.loadedCategoria = categoria;
    this.newRecord.patchValue({
      nome: categoria.nome,
      descricao: categoria.descricao
    })
  }

  excluir(categoria) {
    this.cursosService.deleteCategoriaMentoria(categoria.id).subscribe(response => {
      if ((response as any).success) {
        PNotify.success({
          text: 'Categoria excluída com sucesso!',
          delay: 3000
        });
        this.limparForm();
      }
    })
  }

  limparForm() {
    this.submited = false;
    this.loadedCategoria = undefined;
    this.newRecord.reset();
    this.isEdit = false;
    this.objToSend = {};
    this.ngOnInit();
    window.scroll(0, 0);
  }

}
