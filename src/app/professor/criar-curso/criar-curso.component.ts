import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HeaderService } from 'src/app/header/header.service';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { EventosService } from '../../eventos/eventos.service';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as underscore from 'underscore';
import $ from 'jquery';
import { environment } from 'src/environments/environment';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
    selector: 'app-criar-curso',
    templateUrl: './criar-curso.component.html',
    styleUrls: ['./criar-curso.component.css']
})
export class CriarCursoComponent implements OnInit {

    constructor(
        private formBuilder: FormBuilder,
        private headerService: HeaderService,
        private categoriasService: CategoriasService,
        private eventosService: EventosService,
        private criarCursoService: CriarCursoService,
        private configuracoesStore: ConfiguracoesStore,
    ) { }

    newRecord: FormGroup;
    IMG_URL = environment.img_url
    modulos: FormArray;
    secoes: FormArray;
    agendas: FormArray;
    tags: FormArray;
    faculdades: FormArray;
    fk_cursos_categoria: FormArray;
    questoes: FormArray;
    quiz: FormGroup;

    rascunhos: any;
    enviados: any[];
    categorias: any;
    projetos: any;
    certificados: any;
    professores: any;
    curadores: any;
    produtoras: any;
    criarCursoForm: any;
    apiResponse: any;
    loading: any;
    submitted: any;
    success: any;
    error: any;
    editar: any = false;
    id_usuario: any;
    selectedProfessores = [];
    cursoTipo = 0;
    listaOrdem = [];
    listaAprovacao = [];
    listaCorretas = [];
    opcoes = [];
    status = [
        'Rascunho', 'Revisar', 'Não Aprovado', 'Aprovado', 'Publicado'
    ]

    ngOnInit() {

        this.configuracoesStore.state$.subscribe(state => {
            const confNavColor =
                state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
            this.headerService.changeNavColor.next(confNavColor);
        });

        // tslint:disable-next-line:radix
        this.id_usuario = parseInt(localStorage.getItem('usuario_id'));
        this.editar = false;
        this.newRecord = this.formBuilder.group({
            id: null,
            duracao_dias: null,
            disponibilidade_dias: null,
            fk_faculdade: null,
            faculdade: this.formBuilder.array([this.createProjeto()]),
            status: ['', [Validators.required]],
            titulo: ['', [Validators.required]],
            trabalho: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            objetivo_descricao: ['', [Validators.required]],
            publico_alvo: ['', [Validators.required]],
            endereco_presencial: ['', [Validators.required]],
            idioma: ['', [Validators.required]],
            formato: ['', [Validators.required]],
            agenda: this.formBuilder.array([this.createData()]),
            duracao_total: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            valor_de: ['', [Validators.required]],
            fk_cursos_categoria: this.formBuilder.array([this.createCategoria()]),
            fk_certificado: ['', [Validators.required]],
            fk_cursos_tipo: ['', [Validators.required]],
            fk_professor: ['', [Validators.required]],
            fk_professor_participante: ['', [Validators.required]],
            fk_produtora: ['', [Validators.required]],
            curador_share: ['', [Validators.required]],
            produtora_share: ['', [Validators.required]],
            professorparticipante_share: ['', [Validators.required]],
            professorprincipal_share: ['', [Validators.required]],
            fk_curador: ['', [Validators.required]],
            imagem: ['', [Validators.required]],
            numero_maximo_alunos: ['', [Validators.required]],
            numero_minimo_alunos: ['', [Validators.required]],
            modulos: this.formBuilder.array([this.createModule()]),
            tags: this.formBuilder.array([this.createTag()]),
            quiz: this.createQuiz(),
        });

        this.carregaCombos();
        this.getCursosProfessor();
    }

    getCursosProfessor() {
        try {
            this.criarCursoService.getCursosProfessor(localStorage.getItem('usuario_id'), null, environment.faculdade_id).subscribe((rascunhos) => {
                this.rascunhos = rascunhos.items;
            });
        } catch (error) {
            console.log('==== error ====');
            console.log(error);
        }
    }

    carregaCombos() {
        try {
            this.criarCursoService.getCategorias().subscribe((categorias) => {
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
            });
        } catch (error) {
            console.log('==== error ====');
            console.log(error);
        }

        try {
            this.criarCursoService.getCuradores().subscribe((curadores) => {
                this.curadores = curadores.items;
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
        this.listaOrdem = [];
        this.listaCorretas = [];
        this.listaAprovacao = [];

        for (let i = 1; i <= 30; i++) { this.listaOrdem.push(i); }
        for (let i = 1; i <= 5; i++) { this.listaCorretas.push(i); }
        for (let i = 0; i <= 100; i = i + 5) { this.listaAprovacao.push(i); }
    }

    getValues(type) {
        try {
          this.criarCursoService.getCurso(type.id).subscribe((criarCursoForm) => {
            this.editar = true;
            this.criarCursoForm = criarCursoForm.data;
            this.fillForm(this.criarCursoForm);

          });
        } catch (error) {
          console.log('==== error ====');
          console.log(error);
        }
    }

    fillForm(type) {
        // this.ngOnInit();
        this.carregaCombos();
        this.newRecord.patchValue({...type.curso, ...type.dados_valor});
        this.cursoTipo = type.curso.fk_cursos_tipo;
        type.agendas_cadastradas.forEach((e, index) => {
            this.clickToAddData();
            this.agendas.controls[index].patchValue({
                id: e.id,
                data_inicio: e.data_inicio,
                descricao_agenda: e.nome,
                hora_inicio: e.hora_inicio,
                hora_fim: e.hora_final
            });
        });
        document.getElementById('form_create_course_online').scrollIntoView();
        type.faculdades_cadastradas.forEach((e, index) => {
            this.addProjeto();
            this.faculdades.controls[index].patchValue({
                id: e.id,
                fk_faculdade: e.fk_faculdade,
                duracao_dias: e.duracao_dias,
                disponibilidade_dias: e.disponibilidade_dias,
            });
        });

        type.tags_cadastradas.forEach((e, index) => {
            this.addTags();
            this.tags.controls[index].patchValue({
                id: e.id,
                nome: e.tag
            });
        });

        type.lista_categorias.forEach((e, index) => {
            this.addCategoria();
            this.fk_cursos_categoria.controls[index].patchValue({
                id: e.id,
                fk_categoria: e.fk_curso_categoria,
            });
        });
        type.secoes_cadastradas.forEach((e, index) => {
            this.clickToAddModule();
            this.secoes.controls[index].patchValue({
                id: e.id,
                titulo: e.titulo,
                ordem: e.ordem,
            });
            let modulos_cadastrados = type.modulos_cadastrados.filter(h => h.fk_curso_secao == e.id);
            modulos_cadastrados.forEach((f, i) => {
                this.clickToAddSubModulo(this.secoes.controls[index]);
                this.modulos.controls[i].patchValue({...f});
            });
        });

        this.newRecord.get('quiz').patchValue(type.quiz);
        type.quiz_questao.forEach((e, index) => {
            this.clickToAddQuestao(this.newRecord.get('quiz'));
            this.questoes.controls[index].patchValue({...e, op: this.retornaOpcoes(type.quiz_resposta[e.id])});
        });

        this.opcoes = type.quiz_resposta;
        this.newRecord.get('id').setValue(type.curso.id);
    }

    novo() {
        this.newRecord.reset()
        this.ngOnInit();
    }

    retornaOpcoes(respostas) {
        return {
            descricao1: respostas[0].descricao,
            descricao2: respostas[1].descricao,
            descricao3: respostas[2].descricao,
            descricao4: respostas[3].descricao,
            descricao5: respostas[4].descricao,
        };
    }

    criaEvento() {
        const formData = new FormData();
        formData.append('imagem', this.newRecord.get('imagem').value);
        formData.append('fk_categoria', this.newRecord.get('fk_cursos_categoria').value);
        formData.append('fk_faculdade', this.newRecord.get('fk_faculdade').value);
        formData.append('titulo', this.newRecord.get('titulo').value);
        formData.append('descricao', this.newRecord.get('descricao').value);

        this.eventosService.criarEvento(formData).subscribe(response => {
            this.apiResponse = response
            this.loading = false

            if (this.apiResponse.success == true) {
                this.success = true;
                this.error = null;
            } else {
                this.success = false;
                this.error = this.apiResponse.error;
            }
        }, error => {
            console.log(error);
        });
    }

    onFormSubmit() {
        this.loading = true
        if (this.cursoTipo == 3) {
            this.criaEvento();
            return;
        }

        this.newRecord.get('fk_professor').setValue(this.id_usuario);

        if (this.editar) {
            this.questoes.controls.forEach((e, index) => {
                const questao = e.value;
                if (questao.resposta_correta != '') {
                    this.opcoes[questao.id][0].descricao = questao.op.descricao1;
                    this.opcoes[questao.id][1].descricao = questao.op.descricao2;
                    this.opcoes[questao.id][2].descricao = questao.op.descricao3;
                    this.opcoes[questao.id][3].descricao = questao.op.descricao4;
                    this.opcoes[questao.id][4].descricao = questao.op.descricao5;
                    this.questoes.controls[index].patchValue({
                        id: questao.id,
                        fk_quiz: questao.fk_quiz,
                        titulo: questao.titulo,
                        resposta_correta: questao.resposta_correta,
                        status: 1,
                        opcao: this.opcoes,
                        op: questao.op,
                    });
                }
            });
        }

        this.newRecord.get('fk_cursos_tipo').setValue(this.cursoTipo);

        this.criarCursoService.postData(this.newRecord.value, this.editar).subscribe(response => {
            this.apiResponse = response
            this.loading = false

            document.getElementById('mensagem-retorno').scrollIntoView();
            if (this.apiResponse.success == true) {
                this.success = true;
                this.getCursosProfessor()
                this.error = null;
            } else {
                this.success = false;
                this.error = this.apiResponse.error;
            }
        }, error => {
            console.log(error);
        });
    }

    onFileSelected(files) {
        const formData = new FormData();
        formData.append('imagem', files[0], files[0].name);
        formData.append('input', 'imagem');
        formData.append('tipo', 'curso');
        this.criarCursoService.uploadFiles(formData).subscribe(response => {
            if (response.success == true) {
                this.newRecord.get('imagem').setValue(response.data);
            }
        });
    }
    onModuleFileSelected(files, module) {
        const formData = new FormData();
        formData.append('input', 'modulos');
        formData.append('tipo', 'modulo');
        formData.append('imagem', files[0], files[0].name);
        this.criarCursoService.uploadFiles(formData).subscribe(response => {
            if (response.success == true) {
                module.get('arquivo').setValue(response.data);
            }
        });
    }

    createModule(): FormGroup {
        return this.formBuilder.group({
            id: null,
            titulo: ['', [Validators.required]],
            ordem: ['', [Validators.required]],
            modulos: null,
            subModulos: this.formBuilder.array([this.createSubModulos()])
        });
    }
    createQuiz(): FormGroup {
        this.quiz = this.formBuilder.group({
            id: null,
            percentual_acerto: ['', [Validators.required]],
            questao: this.formBuilder.array([this.createQuestao()])
        });
        return this.quiz;
    }

    createQuestao(): FormGroup {
        return this.formBuilder.group({
            id: null,
            fk_quiz: null,
            titulo: ['', [Validators.required]],
            resposta_correta: ['', [Validators.required]],
            status: 1,
            op: this.createOpcoes(),
            opcao: null
        });
    }

    createOpcoes(): FormGroup {
        return this.formBuilder.group({
            descricao1: ['', [Validators.required]],
            descricao2: ['', [Validators.required]],
            descricao3: ['', [Validators.required]],
            descricao4: ['', [Validators.required]],
            descricao5: ['', [Validators.required]],
        });
    }

    createTag(): FormGroup {
        return this.formBuilder.group({
            id: null,
            nome: ['', [Validators.required]],
        });
    }

    createCategoria(): FormGroup {
        return this.formBuilder.group({
            id: null,
            fk_categoria: ['', [Validators.required]],
        });
    }

    createProjeto(): FormGroup {
        return this.formBuilder.group({
            id: null,
            fk_faculdade: ['', [Validators.required]],
            duracao_dias: ['', [Validators.required]],
            disponibilidade_dias: ['', [Validators.required]],
        });
    }

    createSubModulos(): FormGroup {
        return this.formBuilder.group({
            id: null,
            titulo: ['', [Validators.required]],
            url_video: ['', [Validators.required]],
            carga_horaria: ['', [Validators.required]],
            arquivo: ['', [Validators.required]]
        });
    }

    createData(): FormGroup {
        return this.formBuilder.group({
            id: null,
            data_inicio: ['', [Validators.required]],
            descricao_agenda: ['', [Validators.required]],
            hora_inicio: ['', [Validators.required]],
            hora_fim: ['', [Validators.required]]
        });
    }

    createProfessores(professor, form): FormGroup {
        let prov;
        if (form == undefined) {
            prov = false;
        } else {
            prov = form.professoresId.includes(professor.id)
        }
        return this.formBuilder.group({
            id: new FormControl(professor.id),
            nome: new FormControl(professor.nome),
            value: new FormControl(prov)
        });
    }

    clickToAddModule() {
        this.secoes = this.newRecord.get('modulos') as FormArray;
        this.secoes.push(this.createModule());
    }

    clickToAddSubModulo(modulo) {
        this.modulos = modulo.get('subModulos') as FormArray;
        this.modulos.push(this.createSubModulos());
    }

    clickToAddQuestao(quiz) {
        this.questoes = quiz.get('questao') as FormArray;
        this.questoes.push(this.createQuestao());
    }
    clickToAddData() {
        this.agendas = this.newRecord.get('agenda') as FormArray;
        this.agendas.push(this.createData());
    }

    addProjeto() {
        this.faculdades = this.newRecord.get('faculdade') as FormArray;
        this.faculdades.push(this.createProjeto());
    }

    addCategoria() {
        this.fk_cursos_categoria = this.newRecord.get('fk_cursos_categoria') as FormArray;
        this.fk_cursos_categoria.push(this.createCategoria());
    }

    addTags() {
        this.tags = this.newRecord.get('tags') as FormArray;
        this.tags.push(this.createTag());
    }

    changeCheckbox(item) {
        item.value = !item.value;
    }

    stopPropagation(e: Event) {
        e.stopPropagation();
    }

    getStatus(status) {
        return this.status[status - 1];
    }

    get formProfessor() {
        return this.newRecord.get('professor');
    }

    get formModulo() {
        this.secoes = this.newRecord.get('modulos') as FormArray;
        return this.secoes;
    }

    get formQuestao() {
        this.questoes = this.newRecord.get('quiz').get('questao') as FormArray;
        return this.questoes;
    }

    get formTags() {
        this.tags = this.newRecord.get('tags') as FormArray;
        return this.tags;
    }

    get formDatas() {
        this.agendas = this.newRecord.get('agenda') as FormArray;
        return this.agendas;
    }

    get formProjeto() {
        this.faculdades = this.newRecord.get('faculdade') as FormArray;
        return this.faculdades;
    }

    get formCategoria() {
        this.fk_cursos_categoria = this.newRecord.get('fk_cursos_categoria') as FormArray;
        return this.fk_cursos_categoria;
    }

    formSubModulos(index) {
        return ((this.newRecord.get('modulos') as FormArray).at(index) as FormArray);
    }
    addProfessor() {
        this.selectedProfessores.push(underscore.findWhere(this.professores,{id:Number(this.newRecord.get('professor').value)}));

    }

    removeProfessor(item, index) {
        item.splice(index, 1);
    }

    setTipoCurso() {
        this.cursoTipo = this.newRecord.get('fk_cursos_tipo').value;
    }

    removeAgenda(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.agendas.removeAt(index);
    }

    removeSecao(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.secoes.removeAt(index);
    }

    removeModulo(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.modulos.removeAt(index);
    }

    removeQuestao(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.questoes.removeAt(index);
    }

    removeProjeto(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.faculdades.removeAt(index);
    }

    removeCategoria(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.fk_cursos_categoria.removeAt(index);
    }

    removeTags(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.tags.removeAt(index);
    }

}
