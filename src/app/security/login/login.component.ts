import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';

import { FormGroup, Validators, FormBuilder, EmailValidator} from '@angular/forms';
import { NotificationService } from '../../shared/messages/notification.service';

import $ from 'jquery';
import { environment } from 'src/environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';
import { LoginStore } from '../../stores/login.store';
import {ConfiguracoesStore} from '../../stores/configuracoes.store';

@Component({
  selector: 'mt-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // @ts-ignore
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  IMG_URL = environment.img_url;
  formLogin: FormGroup;
  formRecover: FormGroup;
  email: string;
  password: string;
  error: string;
  mensagem: string;
  loading = false;
  submitted = false;
  enviado = false;
  mensagemSucesso = false;
  mensagemErro = false;
  siteKey = '6Lf_IrsUAAAAAFyIzfQBde1rxZx_q1IdtmkNKr7x';

  current: any = {} ;

  monstrarESenha = false;
  lembrarMinhaSenha = 2;
  configuracoes;

  constructor(private loginService: LoginService,
              private notificationService: NotificationService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private formBuilder: FormBuilder,
              private loginStore: LoginStore,
              private configuracoesStore: ConfiguracoesStore,
              ) {
  }

  ngOnInit() {
      this.createForm();
      this.createFormRecover();

      this.loginStore.state$.subscribe(state => {
          this.current = state.current;
      });

      this.configuracoesStore.state$.subscribe(state => {
          this.configuracoes = state.configuracao;
          if(this.configuracoes.layoutHome == 4){
              var interval = setInterval(()=>{
                  if($('#loginModal app-mt-logotipo img').length){
                    $('#loginModal app-mt-logotipo img').attr('src','../assets/img/perennials/logo-perennials.png')
                      clearInterval(interval);
                  }
              },100)
             
          }
      });

      this.formLogin.get('email').setValue('');
      this.formLogin.get('password').setValue('');

      if (typeof(localStorage.userN) !== 'undefined' && localStorage.userN !== 'null') {
          this.formLogin.get('email').setValue(localStorage.userN);
          this.formLogin.get('password').setValue(localStorage.pass);
      }

      this.rememberfunction();
  }

    handleSuccess(e) {
      this.formLogin.get('recaptcha').setValue(e);
  }

  login() {

    const email = this.formLogin.get('email').value;
    const password = this.formLogin.get('password').value;
    const recaptcha = this.formLogin.get('recaptcha').value;

    this.loginService.login(email, password, recaptcha).subscribe(
      () => {
          this.loading = false;
          this.fecharModal();
          let urlAcesso = ['/'];

          const pedidoAberto = localStorage.getItem('pedidoAberto');
          if (pedidoAberto == 'Sim') {
              urlAcesso = ['/carrinho'];
          }

          this.router.navigate(urlAcesso);
          this.mensagemErro = false;
          this.mensagemSucesso = false;
      }, () => this.handleError());

    this.handleModalBackdrop();
  }

  handleModalBackdrop() {
      const modalBackdropElement = document.getElementsByClassName('modal-backdrop fade show') as HTMLCollectionOf<HTMLElement>;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < modalBackdropElement.length; i++) {
          modalBackdropElement[i].style.display = 'none';
      }
  }

  loginAcessoRestrito() {
      const email = this.formLogin.get('email').value;
      const password = this.formLogin.get('password').value;
      const recaptcha = this.formLogin.get('recaptcha').value;

      this.loginService.loginAcessoRestrito(email, password, recaptcha)
          .subscribe( () => {
              this.loading = false;
              this.fecharModal();
              this.router.navigate(['/acesso-restrito']);
              this.mensagemErro = false;
              this.mensagemSucesso = false;
          }, () => this.handleError());

      this.handleModalBackdrop();
  }

  handleError() {
      this.mensagemErro = false;
      this.mensagemSucesso = false;
      this.loading = false;
      this.error = 'E-mail ou senha inválida!';
      this.captchaElem.resetCaptcha();

      this.createForm();

      setTimeout(() => { this.error = ''; }, 6000);
  }

  fecharModal() {
    $(document.body).removeClass('modal-open');
    $('#loginModal .close').click();
  }
  
  createForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, EmailValidator]],
      password: ['', [Validators.required]],
      recaptcha: ['', Validators.required]
    });
  }

  onSubmit() {
    // stop here if form is invalid
    this.rememberfunction();
    if (this.formLogin.invalid) {
        return;
    }

    this.rememberfunction();
    this.error = '';
    this.loading = true;

    if (this.current.endpoint == 'loginAluno') {
        this.login();
    } else if (this.current.endpoint == 'loginAcessoRestrito') {
        this.loginAcessoRestrito();
    } else {
        this.error = 'Acesso não permitido!';
    }
  }

  createFormRecover() {
      this.formRecover = this.formBuilder.group({
          email: ['', [Validators.required, Validators.email, EmailValidator]],
      });
  }
  
  onSubmitRecover() {
    this.enviado = true;
    if (this.formRecover.status == 'INVALID') {
      return;
    }

    const email = this.formRecover.get('email').value;

    this.loginService.recuperaSenha(email).subscribe(
        (data) => {
            if (data.success) {
                this.mensagem = data.mensagem;
                this.mensagemSucesso = true;
                this.mensagemErro = false;
            } else {
                this.mensagem = data.error;
                this.mensagemErro = true;
                this.mensagemSucesso = false;
            }
        },
        () => {
            this.loading = false;
            this.mensagem = 'Não foi possível enviar o email com a nova senha!';
            setTimeout(() => { this.mensagem = ''; }, 6000);
        }
    );
    // to build
  }

  submittedChangeRecover() {
    // to build
  } 

  triggerPassword() {
    this.monstrarESenha = !this.monstrarESenha;
  }

  rememberMe() {
    if (this.lembrarMinhaSenha == 2) {
      this.lembrarMinhaSenha = 1;
      this.rememberfunction();
    } else if (this.lembrarMinhaSenha == 1) {
      this.lembrarMinhaSenha = 2;
      this.rememberfunction();
    }
    
  }
    
  rememberfunction() {
    if (this.lembrarMinhaSenha == 2) {
      const email = this.formLogin.get('email').value;
      const password = this.formLogin.get('password').value;
      this.loginService.rememberMe(email, password);
    } else if (this.lembrarMinhaSenha == 1) {
      this.loginService.removeRememberMe();  
    }
  }
}
