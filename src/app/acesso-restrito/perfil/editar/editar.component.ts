import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { Aluno } from 'src/app/aluno/aluno.model'; 
import {FormGroup, FormControl, Validators, AbstractControl, ValidationErrors} from '@angular/forms';

import $ from 'jquery';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from 'src/environments/environment';
import { Endereco } from 'src/app/aluno/endereco.model';
import { Credenciais } from 'src/app/aluno/credenciais.model';
import { NotificationService } from '../../../shared/messages/notification.service';
import { PasswordMatchValidator } from './passwordconfirmation.validator';
import { LoginService } from '../../../security/login/login.service';
import { User } from '../../../security/login/user.model';
import { Select2OptionData } from 'ng2-select2';
import {ParceirosService} from '../../../home/parceiros/parceiros.service';
import {CursosService} from '../../../curso/cursos.service';
import Inputmask from 'inputmask';
import moment from 'moment';
import {ConfiguracoesStore} from '../../../stores/configuracoes.store';
import {Configuracao} from '../../../configuracao.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-editar',
    templateUrl: './editar.component.html',
    styleUrls: ['./editar.component.css'],
})

export class EditarComponent implements OnInit {
  // IMG_URL = environment.img_url
  // later need to change the img_url of environment instead of setting it
  // setting now, affects the other pictures
  IMG_URL = environment.s3_url;
  formMeuEndereco: FormGroup;
  formMeusDados: FormGroup;
  formTrocarSenha: FormGroup;

  aluno = new Aluno();
  submitted = false;
  success = false;
  successStr = '';
  error = '';
  apiResponse: any;
  loading: boolean;
  info: any;
  usuarioId: number;
  selectedFile: File;
  // fd: FormData;
  fotoNumber: string;
  cursoSuperior = false;
  especializacao = false;
  semestre: any;
  IMG_URL_MAIN: string;

  estados = [];
  cidades = [];

  cursoList = [];
  visualizarSenha = false;
  faculdades = [];
  faculdadeOutros = false;
  faculdadeEspecializacaoOutros = false;

  activeMenu = 'meus-dados';
  tipoEspecializacao = [
      {
          id: '0',
          text: 'Lato Sensu',
          children: [
              {
                  id: 'especializacao',
                  text: 'Especialização'
              },
              {
                  id: 'aperfeicoamento',
                  text: 'Aperfeiçoamento'
              },
              {
                  id: 'mba',
                  text: 'MBA'
              }
          ]
      },
      {
          id: '1',
          text: 'Stricto Sensu',
          children: [
              {
                  id: 'mestrado',
                  text: 'Mestrado'
              },
              {
                  id: 'doutorado',
                  text: 'Doutorado'
              }
          ]
      }
  ];

  public options: Select2Options;

  configuracoes: Configuracao;
  backHomeButton = false;

  constructor(
      private alunoService: AlunoService,
      private headerService: HeaderService,
      private notificationService: NotificationService,
      private loginService: LoginService,
      private parceirosService: ParceirosService,
      private cursosService: CursosService,
      private cdr: ChangeDetectorRef,
      private configuracoesStore: ConfiguracoesStore,
      private router: Router
  ) {}

  ngOnInit() {

    this.configuracoesStore.state$.subscribe(state => {
      this.configuracoes = state.configuracao;     
    });

    this.parceirosService.getParceiros().subscribe((apiResponse) => {
        this.faculdades.push({
            id: '',
            text: 'Selecione'
        });
        const self = this;
        apiResponse.items.forEach((element) => {
            self.faculdades.push({
                id: element.id,
                text: element.nome_faculdade
            });
        });

        this.faculdades.push({
           id: 'outro',
           text: 'Outro'
        });
    });

    this.options = {
        width: '100%',
        containerCssClass: 'select2-customSelect',
        placeholder: 'Selecione',
    };

    this.configuracoesStore.state$.subscribe(state => {
        console.log("oxi")
        if(state.configuracao.layoutHome != 4){        
            const confNavColor =
            state.configuracao.tiposCursosAtivos.header_secundario ? state.configuracao.tiposCursosAtivos.header_secundario : '#DBDADA'
        this.headerService.changeNavColor.next(confNavColor);
        }
    });

    this.headerService.selectedItem.next('user');
    this.createForm(new Aluno());
    this.createEnderecoForm(new Endereco());
    this.createTrocarSenhaForm(new Credenciais());
    this.cdr.detectChanges();
    // tslint:disable-next-line:new-parens
    this.info = new Object;
    this.loading = true;
    this.IMG_URL_MAIN = '/assets/img/default_avatar.jpg';

    this.selectedFile = null;
    this.cursoSuperior = false;

    this.semestre = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // tslint:disable-next-line:radix
    this.usuarioId = parseInt(localStorage.getItem('usuario_id'));
    this.alunoService.getById(this.usuarioId).subscribe((ApiResponse) => {
      this.info = ApiResponse.data;
      this.cursoSuperior = false;
      this.especializacao = false;

      if (this.info.curso_superior == 'sim') {
        this.cursoSuperior = true;
      }

      if (this.info.curso_especializacao == 'sim') {
        this.especializacao = true;
      }

      this.fotoNumber = this.info.foto;

      if (this.info.universidade) {
          this.buscarCursosFaculdade(this.info.universidade);
      }

      let dataNascimento = null;
      if (this.info.data_nascimento) {
          const date = moment(this.info.data_nascimento, 'YYYY-MM-DD');
          dataNascimento = date.format('DD/MM/YYYY');
      }

      this.formMeusDados.setValue({
          nome: this.info.nome,
          sobre_nome: this.info.sobre_nome ? this.info.sobre_nome : null,
          cpf: this.info.cpf ? this.mask(this.info.cpf) : null,
          data_nascimento: dataNascimento,
          universidade: this.info.universidade,
          identidade: this.info.identidade,
          universidade_outro: this.info.universidade_outro,
          curso: this.info.curso,
          curso_outro: this.info.curso_outro,
          semestre: this.info.semestre,
          ra: this.info.matricula,
          curso_superior: this.info.curso_superior ? this.info.curso_superior : 'não',
          fk_faculdade_id: this.info.fk_faculdade_id,
          foto: (this.info.foto) ? this.info.foto : null,
          curso_especializacao: (this.info.curso_especializacao) ? this.info.curso_especializacao : 'não',
          tipo_curso_especializacao: (this.info.tipo_curso_especializacao) ? this.info.tipo_curso_especializacao : null,
          telefone_2: (this.info.telefone_2) ? this.maskTel(this.info.telefone_2) : null,
          especializacao_universidade: (this.info.especializacao_universidade) ? this.info.especializacao_universidade : null,
          especializacao_universidade_outro: (this.info.especializacao_universidade_outro) ?
                                                this.info.especializacao_universidade_outro : null,
      });

      if (this.info.universidade !== 'outro') {
          this.buscarCursosFaculdade(this.info.universidade);
      } else {
          this.faculdadeOutros = true;
      }

      if (this.info.especializacao_universidade === 'outro') {
          this.faculdadeEspecializacaoOutros = true;
      }

      this.formTrocarSenha.setValue({
          email: this.info.email,
          senha: '',
          senha_confirmar: '',
      });

      this.formMeuEndereco.setValue({
        cep: this.info.cep,
        logradouro: this.info.logradouro,
        numero: this.info.numero,
        complemento: this.info.complemento,
        fk_cidade_id: this.info.fk_cidade_id ? this.info.fk_cidade_id : null,
        fk_estado_id: this.info.fk_estado_id ? this.info.fk_estado_id : null,
        fk_usuario: this.usuarioId,
          bairro: this.info.bairro
      });

      if (this.info.fk_estado_id) {
          this.buscarCidades();
      }

      if (this.formMeusDados.get('foto').value) {
          this.IMG_URL_MAIN = this.IMG_URL + '/files/usuario/' + this.formMeusDados.get('foto').value; 
      }
      this.loading = false;
    });

    this.buscarEstado();

    this.formMeusDados.get('universidade').valueChanges.subscribe(val => {
        this.formMeusDados.get('curso').setValidators(this.requiredIf);
        if (val === 'outro') {
            this.formMeusDados.get('curso').clearValidators();
            this.formMeusDados.get('curso').setErrors(null);
        }
        this.formMeusDados.updateValueAndValidity();
    });

    this.formMeusDados.get('curso_superior').valueChanges.subscribe(val => {
      if (val === 'sim') { // for setting validations
          this.formMeusDados.get('universidade').setValidators(this.requiredIf);
          this.formMeusDados.get('curso').setValidators(this.requiredIf);
          this.formMeusDados.get('semestre').setValidators(this.requiredIf);
          this.formMeusDados.get('ra').setValidators(this.requiredIf);
      }
      if (val === 'não') { // for clearing validations
          this.formMeusDados.get('universidade').clearValidators();
          this.formMeusDados.get('curso').clearValidators();
          this.formMeusDados.get('semestre').clearValidators();
          this.formMeusDados.get('ra').clearValidators();
          Object.keys(this.formMeusDados.controls).forEach(key => {
              const controlErrors: ValidationErrors = this.formMeusDados.get(key).errors;
              if (
                  controlErrors && (key == 'universidade' || key == 'curso' || key == 'semestre' || key == 'ra')
              ) {
                  this.formMeusDados.get(key).setErrors(null);
              }
          });
          this.formMeusDados.updateValueAndValidity();
      }
    });

    const im = new Inputmask('99/99/9999');
    im.mask($('#birthday'));
  }

  buscarEnderecoCEP(event) {
      this.alunoService.getEnderecoCep(event.target.value).subscribe((apiResponse) => {
          if (apiResponse.success) {
              const endereco = apiResponse.items;
              this.alunoService.getCidades(endereco.ufId).subscribe((apiResponseCidade) => {
                  this.cidades = apiResponseCidade.items;
                  this.formMeuEndereco.setValue({
                      cep: endereco.cep,
                      logradouro: endereco.logradouro,
                      numero: null,
                      complemento: endereco.complemento,
                      fk_cidade_id: endereco.cidadeId,
                      fk_estado_id: endereco.ufId,
                      fk_usuario: this.usuarioId,
                      bairro: endereco.bairro
                  });
              });
          }
      });
  }

  buscarEstado() {
      this.alunoService.getEstados().subscribe((apiResponse) => {
          this.estados = apiResponse.items;
      });
  }

  buscarCidades() {
      this.alunoService.getCidades(this.formMeuEndereco.get('fk_estado_id').value).subscribe((apiResponse) => {
          this.cidades = apiResponse.items;
      });
  }

  createEnderecoForm(enderecoForm: Endereco) {
      this.formMeuEndereco = new FormGroup({
          cep: new FormControl(enderecoForm.cep, [Validators.required]),
          logradouro: new FormControl(enderecoForm.logradouro, [Validators.required]),
          numero: new FormControl(enderecoForm.numero, [Validators.required]),
          complemento: new FormControl(enderecoForm.complemento),
          fk_cidade_id: new FormControl(enderecoForm.fk_cidade_id, [Validators.required]),
          fk_estado_id: new FormControl(enderecoForm.fk_estado_id, [Validators.required]),
          fk_usuario: new FormControl(enderecoForm.fk_usuario),
          bairro: new FormControl(enderecoForm.bairro)
      });
  }

  createTrocarSenhaForm(credenciaisForm: Credenciais) {
      this.formTrocarSenha = new FormGroup({
          email: new FormControl(credenciaisForm.email, [Validators.required, Validators.email]),
          senha: new FormControl(credenciaisForm.senha, [Validators.required]),
          senha_confirmar: new FormControl(credenciaisForm.senha_confirmar, [
              Validators.required,
              (control: AbstractControl) => {
                if (control.parent) {
                    if (control.parent.value.senha !== control.value) {
                        return {
                            NoPassswordMatch: true
                        };
                    }
                }
                return null;
              }
          ]),
      });
  }

  createForm(formCadastro: Aluno) {

      this.formMeusDados = new FormGroup({
          nome: new FormControl(formCadastro.nome, Validators.required),
          sobre_nome: new FormControl(formCadastro.sobre_nome),
          cpf: new FormControl(formCadastro.cpf),
          identidade: new FormControl(formCadastro.identidade),
          data_nascimento: new FormControl(formCadastro.data_nascimento, [Validators.required, this.isValidBirthdate]),
          universidade: new FormControl(formCadastro.universidade, [this.requiredIf]),
          universidade_outro: new FormControl(formCadastro.universidade_outro),
          curso: new FormControl(formCadastro.curso, [this.requiredIf]),
          curso_outro: new FormControl(formCadastro.curso_outro),
          semestre: new FormControl(formCadastro.semestre, [this.requiredIf]),
          ra: new FormControl(formCadastro.ra, [this.requiredIf]),
          curso_superior: new FormControl(formCadastro.curso_superior, [this.requiredIf]),
          fk_faculdade_id: new FormControl(formCadastro.fk_faculdade_id),
          foto: new FormControl(formCadastro.foto),
          curso_especializacao: new FormControl(formCadastro.curso_especializacao),
          tipo_curso_especializacao: new FormControl(formCadastro.tipo_curso_especializacao),
          especializacao_universidade: new FormControl(formCadastro.especializacao_universidade),
          especializacao_universidade_outro: new FormControl(formCadastro.especializacao_universidade_outro),
          telefone_2: new FormControl(formCadastro.telefone_2),
      });

  }

  requiredIf(control: AbstractControl)  {
        if (control.parent) {
            if (control.parent.value.curso_superior === 'sim' && control.parent.value.universidade !== 'outro' &&
                (control.value == null || control.value == undefined || control.value == '')
            ) {
                return { requiredIf: true };
            }
        }
        return null;
  }
  
  onSubmit() {
      this.loading = true;
      this.submitted = true; 

      if (this.formMeusDados.invalid) {
          console.log(this.formMeusDados);
          return this.loading = false;
      }

      const data = this.formMeusDados.getRawValue();
      const date = moment(data.data_nascimento, 'DD/MM/YYYY');
      data.data_nascimento = date.format('YYYY-MM-DD');

      this.alunoService.update(data, this.usuarioId).subscribe((retorno) => {
            this.apiResponse = retorno;
            this.loading = false;

            if (this.apiResponse.success == true) {
                this.notificationService.success('A informação foi atualizada!');
                this.atualizarLocalStorage(this.apiResponse.data);
                window.scrollTo(0,0);
                this.activeMenu='meu-endereco';
                this.submitted = false;
                
            } else {
                this.notificationService.error('Houve erro ao salvar os dados!');
            }
      });
    
     
   
  }

  atualizarLocalStorage(data) {
      if (data) {
          this.loginService.user = data[0];
          this.loginService.saveUserLocalStorage();
      }
  }

    onSubmitEndereco() {
        this.loading = true;
        this.submitted = true;

        const data = this.formMeuEndereco.getRawValue();
        data.id = this.info.fk_endereco_id ? this.info.fk_endereco_id : null;

        if (this.formMeuEndereco.invalid) {
            this.loading = false;
            console.log(this.formMeuEndereco);
            return false;
        }

        this.alunoService.updateEndereco(data).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Endereço atualizado com sucesso!');
                if(localStorage.getItem('carrinho') && JSON.parse(localStorage.getItem('carrinho')).length && this.info.logradouro == null){
                    this.router.navigate(['/carrinho'])
                } else{
                    this.backHomeButton = true;
                }
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados');
            }
        });
    }

    onSubmitTrocarSenha() {
        this.loading = true;
        this.submitted = true;

        if (this.formTrocarSenha.invalid) {
            this.loading = false;
            return false;
        }

        this.alunoService.updateCredentials(this.formTrocarSenha.getRawValue(), this.usuarioId).subscribe((apiResponse) => {
            this.loading = false;
            if (apiResponse.success) {
                this.notificationService.success('Credenciais atualizadas com sucesso!');
                this.atualizarLocalStorage(apiResponse.data);
            } else {
                this.notificationService.error('Houve um erro ao salvar os dados');
            }
        });

    }

    onFileSelected(event) {
        this.selectedFile = event.target.files[0];
        $('#user_avatar').attr('src', URL.createObjectURL(event.target.files[0]));
    }

    onUpload() {

        if (!this.selectedFile) {
            this.notificationService.error('Você precisa selecionar uma foto!');
            return;
        }

        this.alunoService.fotoUpload(this.selectedFile, this.usuarioId).subscribe((retorno) => {
            this.apiResponse = retorno;
            this.loading = true;

            if (this.apiResponse.success == false) {
                this.notificationService.error('Houve erro ao enviar foto!');
                return false;
            }

            this.success = true;

            this.formMeusDados.patchValue({ foto: this.apiResponse.fileNo.toString() });
            this.fotoNumber = this.apiResponse.fileNo.toString();
            this.notificationService.success('A foto foi enviada com sucesso');
        });
    }

    triggerInputFile() {
      $('#profilePicture').trigger('click');
    }

    cpfMask(event) {
        event.target.value = this.mask(event.target.value);
    }

    mask(value) {
      return value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
    }

    celularMask(event) {
      event.target.value = this.maskTel(event.target.value);
      console.log(event.target.value);
    }

    maskTel(value) {
        return value.replace(/\D/g, '')             // Remove tudo o que não é dígito
                    .replace(/(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4');    // Coloca hífen entre o quarto e o quinto dígitos

    }

    isValidBirthdate(c: FormControl) {
        const date = moment(c.value, 'DD/MM/YYYY');
        return (date.isBetween('1900-01-01', moment().format('YYYY-MM-DD')) && date.isValid()) ? null : {
            validateBirthdate: {
                valid: false,
                message: 'Informe uma data de nascimento válida'
            }
        };
    }

    changeUniversidade(universidade) {
        console.log(universidade);
        this.faculdadeOutros = false;
        if (universidade !== 'outro') {
            this.buscarCursosFaculdade(universidade);
            this.formMeusDados.controls.universidade_outro.validator = null;
            this.formMeusDados.controls.curso_outro.validator = null;
        } else {
            this.faculdadeOutros = true;
            this.formMeusDados.controls.universidade_outro.validator = this.requiredIf;
            this.formMeusDados.controls.curso_outro.validator = this.requiredIf;
        }
    }

    changeUniversidadeEspecializacao(uniEspecializacao) {
        this.faculdadeEspecializacaoOutros = false;
        if (uniEspecializacao === 'outro') {
            this.faculdadeEspecializacaoOutros = true;
        }
    }

    changeTipoEspecializacao(tipoCurso) {
        const data = this.formMeusDados.getRawValue();
        data.tipo_curso_especializacao = tipoCurso.value;

        this.formMeusDados.setValue(data);
    }

    changeCurso(curso) {
        const data = this.formMeusDados.getRawValue();
        data.curso = curso.value;

        this.formMeusDados.setValue(data);
    }

    buscarCursosFaculdade(idFaculdade) {
        const data = this.formMeusDados.getRawValue();
        this.cursosService.cursosPorFaculdade(idFaculdade).subscribe((apiResponse) => {
            this.cursoList = [];
            this.cursoList.push({
                id: '',
                text: 'Selecione'
            });
            const self = this;
            apiResponse.items.forEach((element) => {
                self.cursoList.push({
                    id: element.id,
                    text: element.id + ' - ' + element.titulo
                });
            });

            this.formMeusDados.value.curso = data.curso;
        });
    }
    toProperCase(str) {
        str = str.toLowerCase().split(' ');
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
}
