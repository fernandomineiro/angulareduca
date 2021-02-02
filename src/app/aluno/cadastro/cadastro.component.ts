import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlunoService } from 'src/app/aluno/aluno.service';
import { Aluno } from 'src/app/aluno/aluno.model';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators, EmailValidator, FormBuilder } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../security/login/login.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalAvisoService } from '../../header/modal-aviso/modal-aviso.service';
import { SubSink } from 'subsink';

import $ from 'jquery';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styles: [``],
})
export class CadastroComponent implements OnInit, OnDestroy {

  formCadastro: FormGroup;
  aluno = new Aluno();
  submitted = false;
  success = false;
  error: string = '';
  validator: any;
  apiResponse: any;
  loading: boolean = false;
  show: boolean = false;
  passwordInvalid;
  passwordMatch;
  termosAccepted;
  termosComponentFlag: boolean = false;
  estados = [];
  cidades = [];
  subs = new SubSink();

  constructor(
      private alunoService: AlunoService,
      private formBuilder: FormBuilder,
      private loginService: LoginService,
      private http: HttpClient,
      private modalWarning: ModalAvisoService,
      private router: Router,
  ) { }

  ngOnInit() {
    this.createForm(new Aluno());
    this.subs.sink = this.alunoService.getEstados().subscribe((apiResponse) => {
        this.estados = apiResponse.items;
    });
  }

  ngOnDestroy() {
      this.subs.unsubscribe();
  }

  validateCPF(c: FormControl) {
    if (c.value == undefined) {
        return;
    }

    const cpf = c.value.toString();
    return cpf.length >= 11 && cpf.length <= 14 ? null : {
        validateCPF: {
            valid: false,
            message: 'Informe um CPF válido'
        }
    };
  }
  createForm(formCadastro: Aluno) {
    this.formCadastro = this.formBuilder.group({
        nome: ['', [Validators.required]],
        sobre_nome: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email, EmailValidator]],
        senha: ['', [Validators.required]],
        cpf: ['', [Validators.required, this.validateCPF]],
        fk_cidade_id: ['', [Validators.required]],
        fk_estado_id: ['', [Validators.required]],
        telefone_2: ['', Validators.required]
    });
  }

  cpfMask(event) {
    event.target.value = this.mask(event.target.value);
  }

  validateCEP(c: FormControl) {
    if (c.value == undefined) {
        return;
    }
    const cep = c.value.toString();
    return cep.length == 8 ? null : {
        validateCEP: {
            valid: false,
            message: 'Informe um CEP válido'
        }
    };
  }

  toProperCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }

  mask(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
  }

  termosCondicoesShow() {
    this.termosComponentFlag = true;
  }

  termosCondicoesHide() {
    this.termosComponentFlag = false;
  }

  getCEP(cep: any, formCadastro: any) {
    const prov = this.modalWarning;
    this.subs.sink = this.alunoService.getEnderecoCep(cep).subscribe((apiResponse) => {
        if (apiResponse.success == true) {
            const endereco = apiResponse.items;
            this.subs.sink = this.alunoService.getCidades(endereco.ufId).subscribe((apiResponseCidade) => {
                this.cidades = apiResponseCidade.items;
                formCadastro.patchValue({
                    logradouro: this.toProperCase(endereco.logradouro),
                    cidade: this.toProperCase(endereco.localidade),
                    estado: endereco.uf,
                    bairro: this.toProperCase(endereco.bairro),
                    fk_cidade_id: endereco.cidadeId,
                    fk_estado_id: endereco.ufId,
                    fk_endereco_id: endereco.id,
                });
            });
        } else {
            this.modalWarning.openWarning('CEP não encontrado');
            formCadastro.patchValue({
                logradouro: null,
                cidade: null,
                estado: null,
                bairro: null,
                fk_cidade_id: null,
                fk_estado_id: null,
                fk_endereco_id: null
            });
        }

    });
  }

  findCep(e) {
    const cep = e.target.value;
    this.getCEP(cep, this.formCadastro);
  }

  buscarCidades() {
    this.subs.sink = this.alunoService.getCidades(this.formCadastro.value.fk_estado_id).subscribe((apiResponse) => {
        this.cidades = apiResponse.items;
    });
  }

  checkIfAreValid(): boolean {
    let isValid = true;
    if (this.formCadastro.status == 'INVALID') {
        isValid = false;
    }

    const password = this.formCadastro.get('senha').value;

    if (password.length < 8) {
        this.passwordInvalid = true;
        isValid = false;
    }

    if ($('#password_confirm').val() != password) {      
      isValid = false;
      this.passwordMatch = false;
    } else {
      this.passwordMatch = true;
    }

    if (!$('#termos_condicoes').prop('checked')) {
      isValid = false;
      this.termosAccepted = false;
    } else {
      this.termosAccepted = true;
    }

    return isValid;
  }

  
  onSubmit() {
    this.loading = true;
    this.submitted = true;
    console.log('Válido', this.checkIfAreValid());
    if (this.checkIfAreValid()) {
      const data = {
          ...this.formCadastro.value,
          ...{fk_faculdade_id: environment.faculdade_id}
      };
      console.log(data);

      this.subs.sink = this.alunoService.create(data).subscribe((retorno) => {
          this.apiResponse = retorno;
          this.loading = false;

          if (this.apiResponse.success == true) {
              this.success = true;
              this.error = null;
              this.validator = null;
              this.loginService._processarRetorno(retorno);
          } else {
              this.success = false;
              this.error = this.apiResponse.error;
              if (this.apiResponse.validator != undefined) {
                  this.validator = this.apiResponse.validator;
              }
          }
      });
    } else {
        this.loading = false;
    }
  }

  navigateHome() {
    $('#close_modal').click();
    this.router.navigate(['/']);
    
  }
  
  navigateEditar() {
    $('#close_modal').click();
    this.router.navigate(['/editar']);
    
  }

    celularMask(event) {
        event.target.value = this.maskTel(event.target.value);
        console.log(event.target.value);
    }

    maskTel(value) {
        return value.replace(/\D/g, '')             // Remove tudo o que não é dígito
            .replace(/(\d{2})(\d)(\d{4})(\d{4})$/, '($1) $2 $3-$4');    // Coloca hífen entre o quarto e o quinto dígitos

    }
}
