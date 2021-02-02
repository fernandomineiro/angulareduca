import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HeaderService } from 'src/app/header/header.service';
import { CategoriasService } from 'src/app/categorias/categorias.service';
import { CriarCursoService } from 'src/app/professor/criar-curso/criar-curso.service';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { EmbedVideoService } from 'ngx-embed-video';
import $ from "jquery";
import {DomSanitizer} from '@angular/platform-browser';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';
import { MapsAPILoader, MouseEvent } from '@agm/core';
declare var google: any;

function validaDuracao(control: FormControl) {
    const duracao = control.value;
    if (!duracao) {
        return null;
    }
    const validacao = duracao.split(':');
    console.log(duracao);
    if (validacao.length == 2 && validacao[0].length == 2 && validacao[1].length == 2) {
        return null;
    }
    return {
        validaDuracao: {
            valid: false
        }
    };
}

function validaDuracaoAula(control: FormControl) {
    const duracao = control.value;
    if (!duracao) {
        return null;
    }
    const validacao = duracao.split(':');
    console.log(duracao);
    if (validacao.length == 3 && validacao[0].length == 2 && validacao[1].length == 2 && validacao[2].length == 2) {
        return null;
    }
    return {
        validaDuracaoAula: {
            valid: false
        }
    };
}

@Component({
  selector: 'app-criar-curso-remoto',
  templateUrl: './criar-curso-remoto.component.html',
  styleUrls: ['./criar-curso-remoto.component.css']
})
export class CriarCursoRemotoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private headerService: HeaderService,
    private categoriasService: CategoriasService,
    private embedService: EmbedVideoService,
    private sanitizer: DomSanitizer,
    private criarCursoService: CriarCursoService,
    private configuracoesStore: ConfiguracoesStore,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

    newRecord: FormGroup;
    IMG_URL = environment.img_url
    modulos: FormArray;
    secoes: FormArray;
    agendas: FormArray;
    tags: FormArray;
    faculdades: FormGroup;
    fk_cursos_categoria: FormArray;
    questoes: FormArray;
    quiz: FormGroup;

    rascunhos: any;
    documento_atual: any;
    documento_atual_tipo: any;
    teaser: any;
    enviados: any[];
    modulos_teaser: any[] = [];
    modulos_arquivo: any[] = [];
    publicados: any[];
    categorias: any;
    projetos: any;
    certificados: any;
    professores: any = [];
    curadores: any;
    produtoras: any;
    criarCursoForm: any;
    apiResponse: any;
    loading: any;
    submitted: any;
    success: any;
    error: any;
    editar: any;
    id_usuario: any;
    perfil: any;
    selectedProfessores = [];
    listaOrdem = [];
    listaAprovacao = [];
    listaAprovacaoT = [];
    listaCorretas = [];
    opcoes = [];
    status = [
        'Rascunho', 'Revisar', 'Não Aprovado', 'Aprovado', 'Publicado'
    ];
    latitude: number;
    longitude: number;
    zoom: number;
    address: string;
    private geoCoder;
    question: boolean = true;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    ngOnInit() {

        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder;

            this.setCurrentLocation();

            const autocomplete = new google.maps.places.Autocomplete( this.searchElementRef ? this.searchElementRef.nativeElement : null, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    // get the place result
                    const place = autocomplete.getPlace();

                    this.newRecord.get('endereco_presencial').setValue(place.formatted_address);
                    // verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    // set latitude, longitude and zoom
                    this.latitude = place.geometry.location.lat();
                    this.longitude = place.geometry.location.lng();
                    this.zoom = 12;
                });
            });
        });

        this.configuracoesStore.state$.subscribe(state => {
            const confNavColor =
                state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA';
            this.headerService.changeNavColor.next(confNavColor);
        });

        this.id_usuario = parseInt(localStorage.getItem('usuario_id'));
        this.perfil = parseInt(localStorage.getItem('perfil'));
        this.editar = false;
        this.submitted = false;
        this.newRecord = this.formBuilder.group({
            id: null,
            duracao_dias: null,
            disponibilidade_dias: null,
            nota_questionario: ['', []],
            nota_trabalho: ['', []],
            curso_gratis: [false, []],
            fk_faculdade: null,
            fk_criador_id: null,
            faculdade: this.createProjeto(),
            status: ['', []],
            titulo: ['', [Validators.required]],
            trabalho: ['', [Validators.required]],
            professor_responde_duvidas: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            objetivo_descricao: ['', []],
            publico_alvo: ['', []],
            idioma: ['', [Validators.required]],
            teaser: [''],
            duracao_total: ['', [Validators.required, validaDuracao]],
            valor: ['', []],
            valor_de: ['', []],
            fk_cursos_categoria: this.formBuilder.array([this.createCategoria(true)]),
            fk_cursos_tipo: ['', []],
            fk_professor: ['', [Validators.required]],
            fk_produtora: ['', []],
            curador_share: ['', []],
            produtora_share: ['', []],
            professorparticipante_share: ['', []],
            professorprincipal_share: ['', []],
            fk_curador: ['', []],
            imagem: ['', []],
            numero_maximo_alunos: ['', []],
            numero_minimo_alunos: ['', []],
            modulos: this.formBuilder.array([this.createModule()]),
            tags: this.formBuilder.array([this.createTag()]),
            quiz: this.createQuiz(),
            questoes: true
        });

        this.carregaCombos();
        this.getCursosProfessor();
    }
    getCursosProfessor() {
        try {
            this.criarCursoService.getCursosProfessor(localStorage.getItem('usuario_id'), 4, environment.faculdade_id).subscribe((rascunhos) => {
                this.rascunhos = rascunhos.items.rascunhos;
                this.enviados = rascunhos.items.enviados;
                this.publicados = rascunhos.items.publicados;
            });
        } catch (error) {
            console.log('==== error ====');
            console.log(error);
        }
    }

    // Get Current Location Coordinates
    private setCurrentLocation() {
        if ('geolocation' in navigator) {
            this.latitude = -33.8688;
            this.longitude = 151.2195;
            this.zoom = 8;
            this.getAddress(this.latitude, this.longitude);
        }
    }

    getAddress(latitude, longitude) {
        this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
                if (results[0]) {
                    this.zoom = 12;
                    this.address = results[0].formatted_address;
                } else {
                    window.alert('No results found');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }

        });
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
            this.criarCursoService.getProfessores().subscribe((professores) => {
                this.professores = professores.items;
                if (this.perfil == 1) {
                    const professor = this.professores.filter(e => {
                        return e.fk_usuario_id == this.id_usuario;
                    });
                    this.newRecord.get('fk_professor').setValue(professor[0].id);
                }
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

        this.listaOrdem = [];
        this.listaCorretas = [];
        this.listaAprovacao = [];
        this.listaAprovacaoT = [];

        for (let i = 1; i <= 30; i++) { this.listaOrdem.push(i); }
        for (let i = 1; i <= 5; i++) { this.listaCorretas.push(i); }
        for (let i = 0; i <= 100; i = i + 5) { this.listaAprovacao.push(i); }
        for (let i = 0; i <= 100; i = i + 5) {
            this.listaAprovacaoT.push({
                value: i,
                showOff: (i / 10).toFixed(1)
            });
        }

        this.newRecord.get('fk_faculdade').setValue(environment.faculdade_id);
    }


    getValues(type, editar) {
        try {
            this.criarCursoService.getCurso(type.id).subscribe((criarCursoForm) => {
                this.editar = true;
                this.criarCursoForm = criarCursoForm.data;
                if (editar) {
                    this.fillForm(this.criarCursoForm);
                } else {
                    this.visualizarCurso(null, this.criarCursoForm);
                }

            });
        } catch (error) {
            console.log('==== error ====');
            console.log(error);
        }
    }

    preSave(status, e) {
        e.preventDefault();
        this.newRecord.get('status').setValue(status);
        this.onFormSubmit();
    }
    limpar(e) {
        if (e) e.preventDefault();
        this.newRecord.reset();
        $('#preview-curso-video').hide()
        $('#output').remove();
        $('#box_upload').append('<img id="output"/>')
        this.ngOnInit();
        document.getElementById('form_create_course_online').scrollIntoView();
    }

    visualizarCurso(e, dados) {
        let curso;
        if (dados) {
            if (dados.curso.status == 5) {
                window.open(window.location.origin + '/#/curso-remoto/' + dados.curso.id + '/detalhe', '_blank');
            } else {
                let secoes = []
                dados.secoes_cadastradas.forEach((e, index) => {
                    let modulos = []
                    let modulos_cadastrados = dados.modulos_cadastrados.filter(h => h.fk_curso_secao == e.id);
                    modulos_cadastrados.forEach((f, i) => {
                        modulos.push(f);
                    });
                    secoes.push({...e, modulos});
                });
                curso = {
                    ...dados.curso,
                    ...dados.dados_valor,
                    nome_curso: dados.curso.titulo,
                    modulos: secoes,
                    total_minutos: dados.curso.duracao_total,
                    total_modulos: secoes.length,
                    categorias: [{titulo: 'Categoria de teste'}], // nome de categoria mockado
                    nome_professor: 'Professor Teste', // nome de professor mockado
                    sobre_curso: dados.curso.descricao,
                    modulosPresenciais: dados.agendas_cadastradas
                };

                localStorage.setItem('visualizarCursoRemoto', JSON.stringify(curso));
                window.open(window.location.origin + '/#/curso-remoto/' + 0 + '/detalhe', '_blank');
            }
        } else {
            e.preventDefault();
            curso = {
                ...this.newRecord.value,
                valor_de: this.newRecord.get('valor').value,
                nome_curso: this.newRecord.get('titulo').value,
                categorias: ['Categoria de teste'], // criar funcao para retornar os nomes das categorias cadastradas no curso
                nome_professor: 'Professor Teste', // retornar o nome do professor escolhido
                modulosPresenciais: this.newRecord.get('agenda').value,
                sobre_curso: this.newRecord.get('descricao').value
            };

            localStorage.setItem('visualizarCursoRemoto', JSON.stringify(curso));
            window.open(window.location.origin + '/#/curso-remoto/' + 0 + '/detalhe', '_blank');
        }
    }

    getProfessor() {
        let professor = this.newRecord.get('fk_professor').value;
        let professorescolhido = this.professores.filter(p => p.id = professor);
        return professorescolhido.nome_professor;
    }
    getCategorias() {
        let categorias = this.newRecord.get('fk_cursos_categoria').value;
        let nomeescolhidas = []
        categorias.forEach(e => {
            nomeescolhidas.push(this.categorias.filter(cat => cat.id = e));
        });
        return nomeescolhidas;
    }

    fillForm(type) {
        // this.ngOnInit();
        this.carregaCombos();
        if (type.dados_valor) {
            delete type.dados_valor.id;
            delete type.dados_valor.status;
            delete type.dados_valor.fk_criador_id;
        }

        const e = type.faculdades_cadastradas.filter(e => {
            return e.fk_faculdade = environment.faculdade_id;
        });
        const lista_conclusao = type.lista_conclusao.filter(e => {
            return e.fk_faculdade = environment.faculdade_id;
        });

        this.newRecord.patchValue({
            ...type.curso,
            ...type.dados_valor,
            nota_questionario: lista_conclusao[0].nota_questionario,
            nota_trabalho: lista_conclusao[0].nota_trabalho,
            curso_gratis: e[0].curso_gratis
        });

        const duracaoTotal = (this.newRecord.get('duracao_total').value).split(':');

        this.newRecord.get('duracao_total').setValue(duracaoTotal[0] + ':' + duracaoTotal[1])

        type.agendas_cadastradas.forEach((e, index) => {
            if (index > 0) this.clickToAddData();
            else this.agendas = this.newRecord.get('agenda') as FormArray;
            this.agendas.controls[index].patchValue({
                id: e.id,
                data_inicio: e.data_inicio,
                descricao_agenda: e.nome,
                hora_inicio: e.hora_inicio,
                hora_fim: e.hora_final,
                duracao_aula: e.duracao_aula
            });
        });

        document.getElementById('form_create_course_online').scrollIntoView();

        this.newRecord.get('faculdade').patchValue({...e[0], ...lista_conclusao[0]});

        type.tags_cadastradas.forEach((e, index) => {
            if (index > 0) this.addTags();
            else this.tags = this.newRecord.get('tags') as FormArray;
            this.tags.controls[index].patchValue({
                id: e.id,
                nome: e.tag
            });
        });

        if (type.lista_categorias && type.lista_categorias.length > 0) {
            this.removeCategoria(0);
        }
        type.lista_categorias.forEach((e, index) => {
            this.addCategoria();
            this.fk_cursos_categoria.controls[index].patchValue({
                id: e.id,
                fk_categoria: e.fk_curso_categoria,
            });
        });

        type.secoes_cadastradas.forEach((e, index) => {
            if (index > 0) this.clickToAddModule();
            else this.secoes = this.newRecord.get('modulos') as FormArray;
            this.secoes.controls[index].patchValue({
                id: e.id,
                titulo: e.titulo,
                ordem: e.ordem,
            });
            let modulos_cadastrados = type.modulos_cadastrados.filter(h => h.fk_curso_secao == e.id);
            modulos_cadastrados.forEach((f, i) => {
                if (i > 0) this.clickToAddSubModulo(this.secoes.controls[index], index);
                else this.modulos = this.secoes.controls[index].get('subModulos') as FormArray;
                this.modulos.controls[i].patchValue({...f, ...{arquivo: f.url_arquivo}});
                this.teaserCurso(this.modulos.controls[i], index, i);
            });
        });

        if (type.quiz) {
            this.newRecord.get('quiz').patchValue(type.quiz);
            type.quiz_questao.forEach((e, index) => {
                if (index > 0) this.clickToAddQuestao(this.newRecord.get('quiz'));
                else this.questoes = this.newRecord.get('quiz').get('questao') as FormArray;
                this.questoes.controls[index].patchValue({...e, op: this.retornaOpcoes(type.quiz_resposta[e.id])});
            });

            this.opcoes = type.quiz_resposta;
        }
        if (!type.quiz || type.quiz_questao && type.quiz_questao.length == 0) {
            this.question = false;
        }

        this.mapsAPILoader.load().then(() => {
            this.geoCoder = new google.maps.Geocoder();
            this.geoCoder.geocode({
                address: this.newRecord.get('endereco_presencial').value
            }, (results, status) => {
                if (status === 'OK') {
                    if (results[0].geometry.location) {
                        this.latitude = results[0].geometry.location.lat();
                        this.longitude = results[0].geometry.location.lng();
                    }
                }
            });
        });

        this.newRecord.get('id').setValue(type.curso.id);
    }

    novo() {
        this.newRecord.reset()
        this.ngOnInit();
    }

    retornaOpcoes(respostas) {
        return {
            descricao1: ((respostas[0]) ? respostas[0].descricao : ''),
            descricao2: ((respostas[1]) ? respostas[1].descricao : ''),
            descricao3: ((respostas[2]) ? respostas[2].descricao : ''),
            descricao4: ((respostas[3]) ? respostas[3].descricao : ''),
            descricao5: ((respostas[4]) ? respostas[4].descricao : ''),
        };
    }

    onFormSubmit() {
        this.loading = true;
        this.submitted = true;

        this.newRecord.get('questoes').setValue(this.question);
        if (this.newRecord.status == 'INVALID') {
            this.error = 'Campos inválidos, verifique e tente novamente!';
            this.scrollToError();
        } else {
            this.error = '';
            localStorage.setItem('visualizarCursoRemoto', null);

            if (this.perfil != '2') {
                this.newRecord.get('fk_professor').setValue(this.id_usuario);
            }

            if (this.editar) {
                this.questoes.controls.forEach((e, index) => {
                    const questao = e.value;
                    if (questao.resposta_correta != '' && this.opcoes.length > 0) {
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
            } else {
                this.newRecord.get('fk_criador_id').setValue(this.id_usuario);
            }

            this.newRecord.get('fk_cursos_tipo').setValue(4);
            console.log(this.newRecord.value);

            this.criarCursoService.postData(this.newRecord.getRawValue(), this.editar).subscribe(response => {
                this.apiResponse = response;
                this.loading = false;

                document.getElementById('mensagem-retorno').scrollIntoView();
                if (this.apiResponse.success == true) {
                    this.success = this.apiResponse.message;
                    this.submitted = false;
                    this.limpar(null);
                    this.getCursosProfessor();
                    this.error = null;
                } else {
                    this.success = false;
                    this.error = this.apiResponse.error;
                }
            }, error => {
                console.log(error);
            });
        }
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
    onModuleFileSelected(files, module, indexSecao, indexModulo) {
        this.showDoc(files, indexSecao, indexModulo);
        const that = this;
        const formData = new FormData();
        formData.append('input', 'modulos');
        formData.append('tipo', 'modulo');
        formData.append('imagem', files[0], files[0].name);
        this.criarCursoService.uploadFiles(formData).subscribe(response => {
            if (response.success == true) {
                module.get('arquivo').setValue(response.data);
                setTimeout( () => {
                    this.setDocumentoAtual(module);
                }, 200);

                if (files[0].name.match(/\.(mp3|ogg|wav)$/i)) {
                    // File type is .mp3
                    const obUrl = URL.createObjectURL(files[0]);
                    const audio = new Audio(obUrl);
                    audio.addEventListener('loadeddata',() => {
                        console.log(audio.duration);
                        const duracaoTotal = that.criarCursoService.calculaDuracao(audio.duration);
                        console.log(duracaoTotal);
                        module.get('carga_horaria').setValue(duracaoTotal);
                        setTimeout(() => {
                            this.calculaDuracao();
                        }, 500);
                    });
                }
            } else {
                this.error = 'Erro ao fazer upload de arquivo';
                const el = document.getElementById('mensagem-retorno');
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

            }
        });
    }

    createModule(): FormGroup {
        this.modulos_arquivo.push([[]]);
        this.modulos_teaser.push([[]]);
        return this.formBuilder.group({
            id: null,
            titulo: ['', [Validators.required]],
            ordem: ['', []],
            modulos: null,
            subModulos: this.formBuilder.array([this.createSubModulos()])
        });
    }
    createQuiz(): FormGroup {
        this.quiz = this.formBuilder.group({
            id: null,
            percentual_acerto: ['', []],
            questao: this.formBuilder.array([this.createQuestao()])
        });
        return this.quiz;
    }

    createQuestao(): FormGroup {
        return this.formBuilder.group({
            id: null,
            fk_quiz: null,
            titulo: ['', []],
            resposta_correta: ['', []],
            status: 1,
            op: this.createOpcoes(),
            opcao: null
        });
    }

    createOpcoes(): FormGroup {
        return this.formBuilder.group({
            descricao1: ['', []],
            descricao2: ['', []],
            descricao3: ['', []],
            descricao4: ['', []],
            descricao5: ['', []],
        });
    }

    createTag(): FormGroup {
        return this.formBuilder.group({
            id: null,
            nome: ['', []],
        });
    }

    createCategoria(validate): FormGroup {
        if (validate) {
            return this.formBuilder.group({
                id: null,
                fk_categoria: ['', [Validators.required]],
            });
        }
        return this.formBuilder.group({
            id: null,
            fk_categoria: ['', []],
        });
    }

    createProjeto(): FormGroup {
        return this.formBuilder.group({
            id: null,
            id_conclusao: null,
            fk_faculdade: [{value: environment.faculdade_id, disabled: (environment.faculdade_id != 7)}, []],
            duracao_dias: ['', []],
            disponibilidade_dias: ['', []],
            fk_certificado: ['', [Validators.required]],
            frequencia_minima: ['', []],
        });
    }

    createSubModulos(): FormGroup {
        return this.formBuilder.group({
            id: null,
            titulo: ['', [Validators.required]],
            url_video: ['', []],
            carga_horaria: ['', [validaDuracaoAula]],
            arquivo: ['', []],
            aula_ao_vivo:[0, []],
            data_aula_ao_vivo:['', []],
            hora_aula_ao_vivo:['', []],
            link_aula_ao_vivo:['', []],
            data_fim_aula_ao_vivo:['', []],
            hora_fim_aula_ao_vivo:['', []],
        });
    }

    createData(): FormGroup {
        return this.formBuilder.group({
            id: null,
            data_inicio: ['', []],
            descricao_agenda: ['', []],
            hora_inicio: ['', []],
            hora_fim: ['', []],
            duracao_aula: ['', []]
        });
    }

    clickToAddModule() {
        this.secoes = this.newRecord.get('modulos') as FormArray;
        this.secoes.push(this.createModule());
    }

    clickToAddSubModulo(modulo, index) {
        this.modulos_arquivo[index].push([]);
        this.modulos_teaser[index].push([]);
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
        // this.faculdades = this.newRecord.get('faculdade') as FormArray;
        // this.faculdades.push(this.createProjeto());
    }

    addCategoria() {
        this.fk_cursos_categoria = this.newRecord.get('fk_cursos_categoria') as FormArray;
        this.fk_cursos_categoria.push(this.createCategoria(false));
    }

    addTags() {
        this.tags = this.newRecord.get('tags') as FormArray;
        this.tags.push(this.createTag());
    }

    stopPropagation(e: Event) {
        e.stopPropagation();
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
        // this.faculdades = this.newRecord.get('faculdade') as FormArray;
        return this.faculdades;
    }

    get formCategoria() {
        this.fk_cursos_categoria = this.newRecord.get('fk_cursos_categoria') as FormArray;
        return this.fk_cursos_categoria;
    }

    formSubModulos(modulo) {
        this.modulos = modulo.get('subModulos') as FormArray;
        return this.modulos;
    }

    removeAgenda(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.agendas.removeAt(index);
    }

    removeSecao(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.secoes.removeAt(index);
    }

    removeModulo(modulo, secao) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.modulos = secao.get('subModulos') as FormArray;
        this.modulos.removeAt(modulo);
    }

    removeQuestao(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.questoes.removeAt(index);
    }

    removeProjeto(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        // this.faculdades.removeAt(index);
    }

    removeCategoria(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.fk_cursos_categoria.removeAt(index);
    }

    removeTags(index) {
        // this.contactList = this.form.get('contacts') as FormArray;
        this.tags.removeAt(index);
    }
    teaserCurso(event, tipo, index_modulo) {
        if (tipo != null) {
            let url = event.get('url_video').value;
            if (url && url != undefined && url != '') {
                var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/;
                var match = url.match(regExp);
                if (match && match[2].length == 11) {
                    event.get('titulo').patchValue('YouTube Video');
                   event.get('carga_horaria').patchValue('00:00:00');
                   return;
                } else {
                    this.modulos_teaser[tipo][index_modulo] = this.embedService.embed_vimeo(event.get('url_video').value);
                    const that = this;
                    $.get('https://vimeo.com/api/oembed.json?url=https://vimeo.com/' + event.get('url_video').value, function (response) {
                        if (response && response.title && response.duration) {
                            event.get('titulo').patchValue(response.title);
                            const duracaoTotal = that.criarCursoService.calculaDuracao(response.duration);
                            event.get('carga_horaria').patchValue(duracaoTotal);
                        }
                    }).fail(function(error) {
                        console.log(error);
                    });
                    setTimeout(() => {
                        this.calculaDuracao();
                    }, 500);
                }
            }
        } else {
            this.teaser = this.embedService.embed_vimeo(this.newRecord.get('teaser').value);
        }
    }
    loadFile(event) {
        const reader = new FileReader();
        reader.onload = () => {
            let output = document.getElementById('output');
            (output as HTMLImageElement).src = reader.result as string;
            output.style.width = '730px';
            output.style.height = '377px';
        };
        reader.readAsDataURL(event[0]);
    }
    showDoc(files, indexSecao, indexModulo) {
        const reader = new FileReader();
        reader.onload = () => {
            this.modulos_arquivo[indexSecao][indexModulo] = reader.result;
        };
        reader.readAsDataURL(files[0]);
    }
    setDocumentoAtual(documento) {
        if (documento.get('arquivo').value.includes('.mp3')
            || documento.get('arquivo').value.includes('.ogg')
            || documento.get('arquivo').value.includes('.wav')
        ) {
            this.documento_atual_tipo = 'podcast';
            this.documento_atual = this.IMG_URL + '/files/modulo/modulos/' + documento.get('arquivo').value;
        } else if (documento.get('arquivo').value.includes('.png')
            || documento.get('arquivo').value.includes('.jpg')
            || documento.get('arquivo').value.includes('.jpeg')
            || documento.get('arquivo').value.includes('.gif')
        ) {
            this.documento_atual_tipo = 'imagem';
            this.documento_atual = this.IMG_URL + '/files/modulo/modulos/' + documento.get('arquivo').value;
        } else {
            this.documento_atual = 'https://docs.google.com/gview?url=' + this.IMG_URL + '/files/modulo/modulos/' + documento.get('arquivo').value + '&embedded=true';
            this.documento_atual_tipo = 'documento';
        }
        this.documento_atual = this.sanitizer.bypassSecurityTrustResourceUrl(this.documento_atual);
        setTimeout(() => {
        }, 200);
    }
    calculaDuracaoAula(data) {
        let dataInicio = data.get('hora_inicio').value;
        let dataFim = data.get('hora_fim').value;
        if (dataInicio && dataFim) {
            dataInicio = dataInicio.split(':')
            dataFim = dataFim.split(':')

            const start = parseInt(dataInicio[0]) * 60 + parseInt(dataInicio[1]);
            const end = parseInt(dataFim[0]) * 60 + parseInt(dataFim[1]);
            if (end > start) {
                const horaTotal = end - start;
                const horas = Math.round(horaTotal / 60)
                const horass = (horas > 9) ? horas + '' : '0' + horas
                const minutos = horaTotal % 60
                const minutoss = (minutos > 9) ? minutos + '' : '0' + minutos
                data.get('duracao_aula').patchValue(horass + ':' + minutoss);
                this.calculaDuracao();
            } else {
                data.get('duracao_aula').patchValue('00:00');
            }
        }
    }

    scrollTo(el: Element): void {
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    scrollToError(): void {
        const firstElementWithError = document.querySelector('.ng-invalid[formControlName]');
        console.log(firstElementWithError);
        this.scrollTo(firstElementWithError);
    }

    calculaDuracao() {
        const duracaoModulos = Array.from(document.querySelectorAll('.carga_horaria'));
        this.newRecord.get('duracao_total').patchValue(this.criarCursoService.getDuracaoTotal(duracaoModulos, this.agendas));
    }

    processaCargaHorariaValor(event) {
        console.log(event.target.value);
        const horario = event.target.value;
        let validacao = horario.split(':');
        console.log(validacao);

        if (validacao.length == 3 && validacao[0].length == 2 && validacao[1].length == 2 && validacao[2].length == 2) {
            this.calculaDuracao();
        }
    }

    verificaAmbiente() {
        return (environment.faculdade_id != 7);
    }
}
