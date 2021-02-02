import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HeaderService } from 'src/app/header/header.service';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as underscore from 'underscore';
import $ from 'jquery';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';

@Component({
  selector: 'app-criar-curso-evento',
  templateUrl: './criar-curso-evento.component.html',
  styleUrls: ['./criar-curso-evento.component.css']
})
export class CriarCursoEventoComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private headerService: HeaderService,
    private categoriasService: CategoriasService,
    private criarCursoService: CriarCursoService,
    private configuracoesStore: ConfiguracoesStore,
  ) { }
  newRecord: FormGroup;

  items: FormArray;
  IMG_URL = environment.img_url
  rascunhos: any;
  enviados: any;
  categorias: any;
  projetos: any;
  certificados: any;
  professores: any;
  curadores: any;
  produtoras: any;
  criarCursoForm: any;
  selectedProfessores:any;
  ngOnInit() {
    this.selectedProfessores = [];

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
      this.headerService.changeNavColor.next(confNavColor);
    });

    this.newRecord = this.formBuilder.group({
      projeto: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      local: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      estado: ['', [Validators.required]],
      datas:this.formBuilder.array([this.createData()]),
      gratuito:['', [Validators.required]],
      imagem: ['', [Validators.required]], 
      
      atividades:this.formBuilder.array([this.createAtividade()]),
      
     
    });

    try {
      this.criarCursoService.getEnviados(localStorage.getItem('usuario_id'), 3).subscribe((enviados) => {
        this.enviados = enviados;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.criarCursoService.getRascunhos(localStorage.getItem('usuario_id'), 3).subscribe((rascunhos) => {
        this.rascunhos = rascunhos;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.categoriasService.getCategorias(environment.faculdade_id).subscribe((categorias) => {
        this.categorias = categorias.items;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.criarCursoService.getProjetos().subscribe((projetos) => {
        this.projetos = projetos.items;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.criarCursoService.getCertificado(environment.faculdade_id).subscribe((certificados) => {
        this.certificados = certificados.items;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.criarCursoService.getProdutoras().subscribe((produtoras) => {
        this.produtoras = produtoras.items;
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }

    try {
      this.criarCursoService.getProfessores().subscribe((professores) => {
        this.professores = professores.items;
        //this.selectedProfessores.push([{id:'',nome:''}]);       
        
      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  getValues(type) {
    try {
      this.criarCursoService.getCriarEvento(0).subscribe((criarCursoForm) => {
        this.criarCursoForm = criarCursoForm;
        this.criarCursoForm.atividades.forEach(element => {
          this.selectedProfessores.push(element.professores);
        });;
        this.fillForm(type);
               

      });
    } catch (error) {
      console.log('==== error ====');
      console.log(error);
    }
  }

  fillForm(type) {
    this.ngOnInit();   
    this.selectedProfessores = [];   
      this.newRecord.get('projeto').patchValue(this.criarCursoForm.projetoId);
      this.newRecord.get('titulo').patchValue(this.criarCursoForm.titulo);
      this.newRecord.get('descricao').patchValue(this.criarCursoForm.descricao);
      this.newRecord.get('local').patchValue(this.criarCursoForm.local);
      this.newRecord.get('cidade').patchValue(this.criarCursoForm.cidade);
      this.newRecord.get('estado').patchValue(this.criarCursoForm.estado);
     this.newRecord.get('gratuito').patchValue(this.criarCursoForm.gratuito);
    

    this.criarCursoForm.datas.forEach((element,i) => {
      if (i > 0){
        this.clickToAddData();
      }
      ((this.newRecord.get('datas') as FormArray).at(i) as FormGroup).get('data').patchValue(element.data);
      ((this.newRecord.get('datas') as FormArray).at(i) as FormGroup).get('diaSemana').patchValue(element.diaSemana);
      ((this.newRecord.get('datas') as FormArray).at(i) as FormGroup).get('horaInicio').patchValue(element.horaInicio);
      ((this.newRecord.get('datas') as FormArray).at(i) as FormGroup).get('horaTermino').patchValue(element.horaTermino);
      
    });

    this.criarCursoForm.atividades.forEach((element,i) => {
      if (i > 0){
        this.clickToAddAtividade();        
      }
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('tipo').patchValue(element.tipo);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('data').patchValue(element.data);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('horaInicio').patchValue(element.horaInicio);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('horaTermino').patchValue(element.horaTermino);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('preco').patchValue(element.preco);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('precoVenda').patchValue(element.precoVenda);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('categoria').patchValue(element.categoriaId);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('certificado').patchValue(element.certificadoId);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('maxAlunos').patchValue(element.maxAlunos);
      ((this.newRecord.get('atividades') as FormArray).at(i) as FormGroup).get('minAlunos').patchValue(element.minAlunos);
      this.selectedProfessores.push({element:[]});
     

    });

    this.selectedProfessores.forEach((element,i) => {
      if( this.criarCursoForm.atividades[i] != undefined){
        element.element =  this.criarCursoForm.atividades[i].professores;
        console.log('element',element);
      }
        
    });
    console.log("this.selectedProfessores",this.selectedProfessores);



    

   


    console.log(this.newRecord);
  }

  removeProfessor(item,index){
    console.log(item);
    item.splice(index,1);
  }

  onFormSubmit() {       
    let imgFormData = new FormData();
    imgFormData.append('file', ($('#upload_image_course') as any).files);
    let atividades = []; 
    let professoresId = [];   
    this.newRecord.get('atividades').value.forEach((element,i) => {
      console.log("this.selectedProfessores[i]",this.selectedProfessores[i].element);
      professoresId = [];
      this.selectedProfessores[i].element.forEach(element => {
        professoresId.push(element.id);
      });
      atividades.push({
        data: element.data,
        tipo:element.tipo,
        horaTermino:element.horaTermino,
        horaInicio:element.horaInicio,
        preco:element.preco,
        precoVenda:element.precoVenda,
        categoriaId:element.categoria,
        certificado:element.certificado,
        professor:professoresId,
        maxAlunos:element.maxAlunos,
        minAlunos:element.minAlunos 
      })
    });     

    console.log("projeto", this.newRecord.get('projeto').value);
    
    let cursoToSend = {
      projeto: Number(this.newRecord.get('projeto').value),
      titulo: this.newRecord.get('titulo').value,
      descricao: this.newRecord.get('descricao').value,     
      local:this.newRecord.get('local').value,
      cidade:this.newRecord.get('cidade').value,
      estado:this.newRecord.get('estado').value, 
      image:imgFormData,          
      datas:this.newRecord.get('datas').value,
      atividades:atividades,
      gratuito: $('#gratuito').is(':checked')
    }
    console.log(cursoToSend);
    // tipo 3
    //this.criarCursoService.postData(cursoToSend).subscribe();
  }

   changeCheckbox(item) {
    item.value = !item.value;
  }

  stopPropagation(e: Event) {
    console.log("eeee", e);
    e.stopPropagation();
  }

  clickToAddData() {
    this.items = this.newRecord.get('datas') as FormArray;
    this.items.push(this.createData());
  }

  clickToAddAtividade() {
    this.items = this.newRecord.get('atividades') as FormArray;
    this.items.push(this.createAtividade());
    //this.selectedProfessores.push([{id:'',nome:''}]);
    console.log("clickToAddAtividade", this.selectedProfessores);
  }


 
  get formDatas() {
    return this.newRecord.get('datas') as FormArray
  }

  createData(): FormGroup {
    return this.formBuilder.group({
      data: ['', [Validators.required]],      
      diaSemana: ['', [Validators.required]],
      horaInicio:['', [Validators.required]],
      horaTermino:['', [Validators.required]]
    })
  }

  createAtividade(): FormGroup {
   //console.log("this.newRecord.get('atividades') as FormArray",this.newRecord.get('atividades') as FormArray)
    return this.formBuilder.group({
      preco: ['', [Validators.required]],
      precoVenda: ['', [Validators.required]],
      categoria: ['', [Validators.required]],
      certificado: ['', [Validators.required]],           
      maxAlunos:['', [Validators.required]],
      minAlunos:['', [Validators.required]],  
      horaTermino:['', [Validators.required]], 
      horaInicio:['', [Validators.required]],  
      data:['', [Validators.required]],  
      tipo:['', [Validators.required]],  
      professor:['', [Validators.required]], 
    })

  }

  formAtividade() {   
   return this.newRecord.get('atividades') as FormArray
  }

  addProfessor(index){
    console.log("index",index);
    console.log("this.selectedProfessores",this.selectedProfessores);
    var value = Number((this.newRecord.get('atividades') as FormArray).at(index).value.professor);
   
        this.selectedProfessores[index].push(underscore.findWhere(this.professores,{id : value}))
    
    console.log((this.newRecord.get('atividades') as FormArray).at(index).value.professor);
  }



}
