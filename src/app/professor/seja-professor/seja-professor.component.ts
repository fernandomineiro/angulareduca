import { Component, OnInit } from '@angular/core';
import { ProfessorService } from 'src/app/professor/professor.service';
import { Professor, ProfessorFormacao, IProfessorFormacaoTipo } from 'src/app/professor/professor.model';
import { Proposta, IPropostaCategorias, PropostaModulos } from 'src/app/professor/proposta/proposta.model';

import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { ApiErrors } from '../../app.api';
import { HeaderService } from 'src/app/header/header.service';
import { environment } from '../../../environments/environment';
import { AlunoService } from '../../aluno/aluno.service';
import { Select2OptionData } from 'ng2-select2';
import {SejaProfessor} from './seja-professor.model';
import $ from "jquery";
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'app-seja-professor',
  templateUrl: './seja-professor.component.html',
  styleUrls: ['./seja-professor.component.css']
})
export class SejaProfessorComponent implements OnInit {

  constructor(
      private professorService: ProfessorService,
      private headerService: HeaderService,
      private alunoService: AlunoService,
      private configuracoesStore: ConfiguracoesStore,
  ) {
      this.options = {
          width: '100%',
          containerCssClass: 'select2-customSelect'
      };
      this.optionsFormacao = {
          width: '100%',
          containerCssClass: 'select2-customSelect',
          placeholder: 'Grau Acadêmico'
      };

      this.buscarEstado();
  }

  formDados: FormGroup;
  IMG_URL = environment.img_url
  professor = new Professor();
  // tslint:disable-next-line:variable-name
  professor_formacao = [new ProfessorFormacao()];
  // tslint:disable-next-line:variable-name
  tipos_formacao = [];

  error: string = '';
  validator: any;

  estados = [];
  cidades = [{id: '', text: 'Selecione um Estado'}];

  proposta = new Proposta();
  // tslint:disable-next-line:variable-name
  proposta_categorias: IPropostaCategorias[];
  // tslint:disable-next-line:variable-name
  proposta_modulos = [new PropostaModulos()];
  
  submitted = false;
  responsabilidadeAccepted = true;
  public options: Select2Options;
  public optionsFormacao: Select2Options;
  formacaoErro: boolean = false;

  ngOnInit() {
    this.createForm(new SejaProfessor());

    this.headerService.selectedItem.next('professores');

    this.configuracoesStore.state$.subscribe(state => {
      const confNavColor =
          state.configuracao.tiposCursosAtivos.header_primario ? state.configuracao.tiposCursosAtivos.header_primario : '#FFFFFF';
      this.headerService.changeNavColor.next(confNavColor);
    });

    try {

        this.headerService.getBanner(environment.faculdade_id, 'sejaumprofessor').subscribe((ApiResponse) => {
            this.headerService.changeBanner.next(ApiResponse.items);
        });

        this.professorService.getTiposFormacao().subscribe((apiResponse) => {
            // this.tipos_formacao = apiResponse.items;
            this.tipos_formacao = [];
            this.tipos_formacao.push({
                id: 0,
                text: 'Grau Acadêmico',
                selected: true,
                disabled: true
            });
            const self = this;
            let grad = apiResponse.items.filter(item => {
                if (item.id === 2 || item.id === 3 || item.id === 10) return item;
            })
            self.tipos_formacao.push({
                id: 0,
                text: 'Graduação',
                children: grad.map(e => {
                    return {
                        id: e.id,
                        text: e.tipo,
                    };
                })
            });
            let posgra = apiResponse.items.filter(item => {
                if (item.id > 4 && item.id < 10) return item;
            })
            self.tipos_formacao.push({
                id: 0,
                text: 'Pós-Graduação',
                children: posgra.map(e => {
                    return {
                        id: e.id,
                        text: e.tipo,
                    };
                })
            });
        });

        this.professorService.getPropostaCategorias().subscribe((apiResponse) => {
            this.proposta_categorias = apiResponse.items;
        });
    } catch (error) {
      console.log('==== error ====', error);
    }
  }

  createForm(sejaProfessor: SejaProfessor) {
      this.formDados = new FormGroup({
          nome: new FormControl(sejaProfessor.nome, [Validators.required]),
          sobrenome: new FormControl(sejaProfessor.sobrenome, [Validators.required]),
          cpf: new FormControl(sejaProfessor.cpf, [Validators.required]),
          data_nascimento: new FormControl(sejaProfessor.data_nascimento, [Validators.required]),
          telefone_1: new FormControl(sejaProfessor.telefone_1),
          telefone_2: new FormControl(sejaProfessor.telefone_2, [Validators.required]),
          email: new FormControl(sejaProfessor.email, [Validators.required]),
          senha: new FormControl(sejaProfessor.senha),
          cep: new FormControl(sejaProfessor.cep, [Validators.required]),
          logradouro: new FormControl(sejaProfessor.logradouro, [Validators.required]),
          numero: new FormControl(sejaProfessor.numero, [Validators.required]),
          complemento: new FormControl(sejaProfessor.complemento),
          bairro: new FormControl(sejaProfessor.bairro, [Validators.required]),
          estado: new FormControl(sejaProfessor.estado, [Validators.required]),
          cidade: new FormControl(sejaProfessor.cidade, [Validators.required]),
          facebook_link: new FormControl(sejaProfessor.facebook_link),
          insta_link: new FormControl(sejaProfessor.insta_link),
          twitter_link: new FormControl(sejaProfessor.twitter_link),
          linkedin_link: new FormControl(sejaProfessor.linkedin_link),
          youteber_link: new FormControl(sejaProfessor.youteber_link),
          mini_curriculum: new FormControl(sejaProfessor.mini_curriculum, [Validators.required]),
      });
  }

  buscarEstado() {
    this.alunoService.getEstados().subscribe((apiResponse) => {
        this.estados = [];
        this.estados.push({
            id: '',
            text: 'Estado'
        });
        const self = this;
        apiResponse.items.forEach((element) => {
            self.estados.push({
                id: element.id,
                text: this.toProperCase(element.descricao_estado)
            });
        });
    });
  }

  changeEstado(estado) {
    const data = this.formDados.getRawValue();
    data.estado = estado.value;

    this.formDados.setValue(data);
    this.buscarCidades(estado.value);
  }

  changeCidade(cidade) {
    const data = this.formDados.getRawValue();
    data.cidade = cidade.value;
    this.formDados.setValue(data);
  }

  changeFormacao(formacaoId, formacao) {
      formacao.fk_professor_formacao_tipo_id = formacaoId.value;
  }

  buscarCep(cep) {
      this.cepMask(cep)
      this.alunoService.getEnderecoCep(cep.target.value).subscribe((apiResponse) => {
          if (apiResponse.items) {
              this.buscarCidades(apiResponse.items.ufId);

              const data = this.formDados.getRawValue();

              data.cep = this.toProperCase(apiResponse.items.cep);
              data.estado = apiResponse.items.ufId;
              data.cidade = apiResponse.items.cidadeId;
              data.logradouro = this.toProperCase(apiResponse.items.logradouro);
              data.complemento = this.toProperCase(apiResponse.items.complemento);
              data.bairro = this.toProperCase(apiResponse.items.bairro);

              this.formDados.setValue(data);
          }
      });
  }

    cpfMask(event) {
        event.target.value = this.mask(event.target.value);
    }

    cepMask(event) {
        const re = /^([\d]{2})\.*([\d]{3})-*([\d]{3})/; // Expressão regular para colocar máscara no cep

        if (re.test(event.target.value)) {
            return event.target.value.replace(re, '$1.$2-$3');
        }
    }

    mask(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    isValidBirthdate(c: FormControl) {
        if (c.value == undefined || c.value == '') {
            return;
        }

        const birthdate = new Date(c.value);
        return Number(birthdate.getFullYear()) >= 1900 && birthdate < new Date() ? null : {
            validateBirthdate: {
                valid: false,
                message: 'Informe uma data de nascimento válida'
            }
        };
    }

  buscarCidades(estadoId) {
      if (estadoId) {
          const cidade = this.formDados.get('cidade').value;
          this.alunoService.getCidades(estadoId).subscribe((apiResponse) => {
              this.cidades = [];
              this.cidades.push({
                  id: '',
                  text: 'Cidade'
              });
              const self = this;
              apiResponse.items.forEach((element) => {
                  self.cidades.push({
                      id: element.id,
                      text: this.toProperCase(element.descricao_cidade)
                  });
              });

              const data = this.formDados.getRawValue();
              data.cidade = cidade;
              this.formDados.setValue(data);
          });
      }
  }
  
  onSubmit() {
      if (!$('#responsabilidade').prop('checked')) {
          this.responsabilidadeAccepted = false;
          return;
      } else {
          this.responsabilidadeAccepted = true;
      }

      if (this.formDados.invalid) {
          $.each(this.formDados.controls, (element) => {
              if (this.formDados.controls[element].invalid === true) console.log(this.formDados.controls[element])
              this.formDados.controls[element].markAsTouched();
              this.formDados.controls[element].markAsDirty();
          });

          this.error = 'Campos inválidos, corrija os erros e tente novamente';
          document.getElementById('cadastro_form').scrollIntoView();
          return false;
      }

      if (
          !this.professor_formacao[0] ||
          !this.professor_formacao[0].fk_professor_formacao_tipo_id ||
          !this.professor_formacao[0].instituicao ||
          !this.professor_formacao[0].curso ||
          !this.professor_formacao[0].ano_conclusao
      ) {
          this.formacaoErro = true;
          this.error = 'Preencha ao menos uma formação';
          document.getElementById('cadastro_form').scrollIntoView();
          return false;
      } else {
          this.error = null;
          this.formacaoErro = false;
      }

      const data = {
          professor: this.formDados.getRawValue(),
          professor_formacao: this.professor_formacao,
          proposta: this.proposta,
          proposta_modulos: this.proposta_modulos,
          fk_faculdade_id: environment.faculdade_id
      };

      this.professorService.create(data).subscribe((apiResponse) => {
          if (apiResponse.success) {
              this.submitted = true;
              this.error = null;
          } else {
              this.error = apiResponse.messages;
              if (apiResponse.validator != undefined) {
                  this.validator = apiResponse.validator;
              }
              document.getElementById('cadastro_form').scrollIntoView();
              const errors = new ApiErrors();
              errors.handle(apiResponse);
          }
      });
  } 

  
  addFormacao() {
    this.professor_formacao.push(new ProfessorFormacao());
  }
  
  addPropostaMdulo() {
    this.proposta_modulos.push(new PropostaModulos());
  }

  // TODO: Remove this when we're done
  get diagnostic() {
      const data = {
          professor: this.professor,
          professor_formacao: this.professor_formacao,
          proposta: this.proposta,
          proposta_modulos: this.proposta_modulos,
      };
      
      return JSON.stringify(data);
  }
  toProperCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }
}
