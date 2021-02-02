import {BrowserModule, Title} from '@angular/platform-browser';
import {NgModule, LOCALE_ID, ErrorHandler, NO_ERRORS_SCHEMA, APP_INITIALIZER} from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {SlickCarouselModule} from 'ngx-slick-carousel';
import {CommonModule} from '@angular/common';

import { AuthInterceptor } from './security/auth.interceptor';

import { ROUTES } from './app.routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { ParceirosComponent } from './home/parceiros/parceiros.component';

import { HomeComponent } from './home/home.component';
import { AcessoRestritoComponent } from './acesso-restrito/acesso-restrito.component';

import { CursosOnlineComponent } from './curso/cursos-online/cursos-online.component';
import { CursosPresenciaisComponent } from './curso/cursos-presenciais/cursos-presenciais.component';
import { CursosRemotosComponent } from './curso/cursos-remotos/cursos-remotos.component';

import { DetalheCursoOnlineComponent } from './curso/cursos-online/detalhe-curso-online.component';
import { DetalheCursoPresencialComponent } from './curso/cursos-presenciais/detalhe-curso-presencial.component';
import { DetalheCursoRemotoComponent } from './curso/cursos-remotos/detalhe-curso-remoto.component';

import { CategoriaCursosOnlineComponent } from './curso/cursos-online/categoria-cursos-online.component';
import { CategoriaCursosPresenciaisComponent } from './curso/cursos-presenciais/categoria-cursos-presenciais.component';
import { CategoriaCursosRemotosComponent } from './curso/cursos-remotos/categoria-cursos-remotos.component';

import { EventosComponent } from './eventos/eventos.component';
import { DetalheEventoComponent } from './eventos/detalhe-evento.component';
import { CategoriaEventosComponent } from './eventos/categoria-eventos.component';

import { NotFoundComponent } from './not-found/not-found.component';

import { TrilhaConhecimentoComponent } from './trilha-conhecimento/trilha-conhecimento.component';
import { LoginComponent } from './security/login/login.component';
import { UserDetailComponent } from './header/user-detail/user-detail.component';
// tslint:disable-next-line:import-spacing
import { CategoriaTrilhaConhecimentoComponent } from
      './trilha-conhecimento/categoria-trilha-conhecimento/categoria-trilha-conhecimento.component';
import { SobreTrilhaConhecimentoComponent } from './trilha-conhecimento/sobre-trilha-conhecimento/sobre-trilha-conhecimento.component';

import { ProfessorComponent } from './professor/professor.component';
import { ProfessorSobreComponent } from './professor/professor-sobre.component';
import { ProfessorCategoriaComponent } from './professor/professor-categoria.component';
import { SejaProfessorComponent } from './professor/seja-professor/seja-professor.component';

import { ProfessorMeusCursosOnlineComponent } from './professor/meus-cursos/online/online.component';
import { ProfessorMeusCursosPresencialComponent } from './professor/meus-cursos/presencial/presencial.component';
import { ProfessorMeusCursosRemotoComponent } from './professor/meus-cursos/remoto/remoto.component';

import { CadastroComponent } from './aluno/cadastro/cadastro.component';
import { EditarComponent } from './acesso-restrito/perfil/editar/editar.component';

import { AlunoAcessoRestritoComponent } from './aluno/acesso-restrito/acesso-restrito.component';

import { CursandoMenuComponent } from './aluno/cursando/menu.component';

import { MeuCursoComponent } from './aluno/cursando/meu-curso/meu-curso.component';
import { QuestionarioComponent } from './aluno/cursando/questionario/questionario.component';
import { ResultadoComponent } from './aluno/cursando/resultado/resultado.component';

import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { PaymentComponent } from './shopping-cart/payment/payment.component';
import { ThanksComponent } from './shopping-cart/thanks/thanks.component';

import { SharedModule } from './shared/shared.module';
import { AplicationErrorHandler } from './app.error-handler';
import { TutoriaTrabalhosComponent } from './tutoria/tutoria-trabalhos/tutoria-trabalhos.component';
import { AcessoRestritoSidebarComponent } from './acesso-restrito-sidebar/acesso-restrito-sidebar.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSortModule} from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import { TutoriaMensagensComponent } from './tutoria/tutoria-mensagens/tutoria-mensagens.component';
import { TutoriaChatComponent } from './tutoria/tutoria-chat/tutoria-chat.component';
import { ListaPresencaComponent } from './lista-presenca/lista-presenca.component';
import { ListaEsperaComponent } from './lista-espera/lista-espera.component';

import { CursosSugestaoComponent } from 'src/app/curso/cursos-sugestao/cursos-sugestao.component';
import { DisparadorEmailsComponent } from './disparador-emails/disparador-emails.component';

import { AngularEditorModule } from '@kolkov/angular-editor';
import { AgendaComponent } from './agenda/agenda.component';
import { AgendaCursosComponent } from './agenda/agenda-cursos/agenda-cursos.component';
import { AgendaGravacaoComponent } from './agenda/agenda-gravacao/agenda-gravacao.component';
import { StatusAprovacaoComponent } from './status-aprovacao/status-aprovacao.component';
import { AprovacaoFixesComponent } from './status-aprovacao/aprovacao-fixes/aprovacao-fixes.component';

import { MeusEventosComponent } from './eventos/meus-eventos/meus-eventos.component';

import { NgCircleProgressModule } from 'ng-circle-progress';
import { FaqComponent } from './faq/faq.component';
import { PoliticaComponent } from './politica-termos/politica/politica.component';
import { TermosComponent } from './politica-termos/termos/termos.component';
import { DuvidasComponent } from './aluno/cursando/duvidas/duvidas.component';
import { VideoComponent } from './aluno/cursando/video/video.component';
import { SidebarInfoComponent } from './aluno/cursando/sidebar-info/sidebar-info.component';
import { CriarCursoComponent } from './professor/criar-curso/criar-curso.component';
import { CriarCursoOnlineComponent } from './professor/criar-curso/criar-curso-online/criar-curso-online.component';
import { CriarCursoPresencialComponent } from './professor/criar-curso/criar-curso-presencial/criar-curso-presencial.component';
import { CriarCursoRemotoComponent } from './professor/criar-curso/criar-curso-remoto/criar-curso-remoto.component';
import { CriarCursoEventoComponent } from './professor/criar-curso/criar-curso-evento/criar-curso-evento.component';


import {AssinaturaComponent} from './assinaturas/assinatura.component';
import { CardCursosRemotosComponent } from './curso/cursos-remotos/card-cursos-remotos/card-cursos-remotos.component';
import { CardCursosPresenciaisComponent } from './curso/cursos-presenciais/card-cursos-presenciais/card-cursos-presenciais.component';
import {MatDialogModule} from '@angular/material/dialog';
import { FacaAulasComponent } from './aluno/cursando/faca-aulas/faca-aulas.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PesquisarComponent } from './pesquisar/pesquisar.component';
import { CaixaDePesquisaComponent } from './caixa-de-pesquisa/caixa-de-pesquisa.component';
import { QuizAprovadoComponent } from './quiz-aprovado/quiz-aprovado.component';
import { QuizNaoAprovadoComponent } from './quiz-nao-aprovado/quiz-nao-aprovado.component';
import { ModalAvisoComponent } from './header/modal-aviso/modal-aviso.component';
import { MeAviseModalComponent } from './curso/me-avise-modal.component';
import { CardTrilhaConhecimentoComponent } from './trilha-conhecimento/card-trilha-conhecimento/card-trilha-conhecimento.component';
import { ModulosListComponent } from './curso/modulos-list/modulos-list.component';
import {MeusCursosComponent} from './aluno/acesso-restrito/meus-cursos/meus-cursos.component';
import {FavoritosComponent} from './aluno/acesso-restrito/favoritos/favoritos.component';
import {CertificadosComponent} from './aluno/acesso-restrito/certificados/certificados.component';
import {MeusTrabalhosComponent} from './aluno/acesso-restrito/meus-trabalhos/meus-trabalhos.component';
import {PedidosComponent} from './aluno/acesso-restrito/pedidos/pedidos.component';
import {CardComponent} from './aluno/acesso-restrito/card/card.component';
import { NumberMaskDirective } from './directives/number-mask.directive';
import {Select2Module} from 'ng2-select2';
import { CategoriasComponent } from './curso/categorias/categorias.component';
import {MatTabsModule} from '@angular/material/tabs';
import { DialogComponent } from './header/dialog/dialog.component';
import { EditarProfessorComponent } from './professor/editar/editar-professor.component';
import {CredenciaisProfessorComponent} from './professor/editar/credenciais/credenciais-professor.component';
import {MiniCurriculoComponent} from './professor/editar/mini-curriculo/mini-curriculo.component';
import {DadosBancariosComponent} from './professor/editar/dados-bancarios/dados-bancarios.component';
import {EnderecoComponent} from './professor/editar/endereco/endereco.component';
import {LoadingScreenComponent} from './shared/loading-screen/loading-screen.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { QuemSomosProfessorComponent } from './quem-somos/professor/professor.component';
import { VoucherComponent } from './aluno/acesso-restrito/voucher/voucher.component';
import { PesquisaOpiniaoComponent } from './professor/pesquisa-opiniao/pesquisa-opiniao.component';
import { BibliotecaComponent } from './biblioteca/biblioteca.component';
import { AgmCoreModule } from '@agm/core';
import {FieldErrorDisplayComponent} from './field-error-display/field-error-display.component';

import {PerfilComponent} from './acesso-restrito/perfil/perfil.component';
import {CuradorComponent} from './curador/curador.component';
import { ValidarCertificadoComponent } from './validar-certificado/validar-certificado.component';
import { NgxCaptchaModule } from 'ngx-captcha';

import { RelatoriosGraficosComponent } from './professor/relatorios-graficos/relatorios-graficos.component';

import { EmbedVideo } from 'ngx-embed-video';
import { NgxCurrencyModule } from 'ngx-currency';
import {LogotipoComponent} from './logotipo/logotipo.component';
import {ConfiguracoesStore} from './stores/configuracoes.store';
import {environment} from '../environments/environment';
import { Ng5SliderModule } from 'ng5-slider';
import {RangeSliderComponent} from './range-slider/range-slider.component';
import { TodosCursosComponent } from './curso/todos-cursos/todos-cursos.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatPaginatorIntl} from '@angular/material';
import { getPortuguesePaginatorIntl } from './portuguese-paginator-intl';

import { RelatorioAlunosComponent } from './acesso-restrito/relatorio-alunos/relatorio-alunos.component';
import { HistoricoEscolarComponent } from './acesso-restrito/historico-escolar/historico-escolar.component';
import { HistoricoTableComponent } from './acesso-restrito/historico-escolar/historico-table/historico-table.component';
import { GraficoFaturamentoComparativoComponent } from './acesso-restrito/graficos/grafico-faturamento-comparativo/grafico-faturamento-comparativo.component';
import { CurrencyPipe } from '@angular/common';
import { GraficoAssinaturasComponent } from './acesso-restrito/graficos/grafico-assinaturas/grafico-assinaturas.component';
import { AssinaturasAtivasComponent } from './acesso-restrito/graficos/grafico-assinaturas/assinaturas-ativas/assinaturas-ativas.component';
import { PerennialsComponent } from './home/perennials/perennials.component';
import { PerennialsCursosOnlineComponent } from './home/perennials/perennials-cursos-online/perennials-cursos-online.component';
import { CriarConteudoComponent } from './home/perennials/criar-conteudo/criar-conteudo.component';
import { GraficoPedidosComponent } from './acesso-restrito/graficos/grafico-pedidos/grafico-pedidos.component';
import { AulaLiveComponent } from './aluno/cursando/aula-live/aula-live.component';
import { VisualizarCursoComponent } from './home/perennials/visualizar-curso/visualizar-curso.component';
import { MeusCursosMentoriaComponent } from './home/perennials/meus-cursos-mentoria/meus-cursos-mentoria.component';
import { RelatorioFinanceiroComponent } from './acesso-restrito/relatorio-financeiro/relatorio-financeiro.component';
import { PermissoesGuard } from './permissoes/permissoes.guard';
import { GraficoFaturamentoProfessorComponent } from './acesso-restrito/graficos/grafico-faturamento-professor/grafico-faturamento-professor.component';
import { AlunoKrotonComponent } from './aluno/aluno-kroton/aluno-kroton.component';
import { ListaCardCursosComponent } from './home/perennials/lista-card-cursos/lista-card-cursos.component';
import { FilterPipe } from 'src/app/shared/pipes/filter_pipe';
import { CriarCategoriaPerennialsComponent } from './home/perennials/criar-conteudo/criar-categoria-perennials/criar-categoria-perennials.component';
import { FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import { FormlyModule} from '@ngx-formly/core';
import { Store, StoreModule} from '@ngrx/store';
import { StoreDevtoolsModule} from '@ngrx/store-devtools';
import {EffectsModule} from '@ngrx/effects';
import {CalendarModule} from './calendar/calendar.module';
import {ItvModule} from './home/itv/itv.module';
import {reducers, metaReducers, AppState} from './index.reducers';
import {effects} from './index.effects';
import {configuracoes} from './stores/selectors/configuracoes.selector';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    FilterPipe,
    AcessoRestritoComponent,
    ParceirosComponent,
    CursosOnlineComponent,
    CursosPresenciaisComponent,
    CursosRemotosComponent,
    DetalheCursoOnlineComponent,
    CategoriaCursosOnlineComponent,
    CategoriaCursosPresenciaisComponent,
    CategoriaCursosRemotosComponent,
    DetalheCursoPresencialComponent,
    DetalheCursoRemotoComponent,
    EventosComponent,
    DetalheEventoComponent,
    CategoriaEventosComponent,
    MeusEventosComponent,
    LoginComponent,
    UserDetailComponent,
    NotFoundComponent,
    TrilhaConhecimentoComponent,
    ProfessorComponent,
    ProfessorSobreComponent,
    ProfessorCategoriaComponent,
    SejaProfessorComponent,
    ProfessorMeusCursosOnlineComponent,
    ProfessorMeusCursosPresencialComponent,
    ProfessorMeusCursosRemotoComponent,
    NotFoundComponent,
    CategoriaTrilhaConhecimentoComponent,
    SobreTrilhaConhecimentoComponent,
    CadastroComponent,
    AlunoAcessoRestritoComponent,
    CursandoMenuComponent,
    MeuCursoComponent,
    QuestionarioComponent,
    ResultadoComponent,
    EditarComponent,
    ShoppingCartComponent,
    PaymentComponent,
    ThanksComponent,
    CursosSugestaoComponent,
    TutoriaTrabalhosComponent,
    AcessoRestritoSidebarComponent,
    TutoriaMensagensComponent,
    TutoriaChatComponent,
    ListaPresencaComponent,
    DisparadorEmailsComponent,
    AgendaComponent,
    AgendaCursosComponent,
    AgendaGravacaoComponent,
    StatusAprovacaoComponent,
    AprovacaoFixesComponent,
    FaqComponent,
    PoliticaComponent,
    TermosComponent,
    DuvidasComponent,
    SidebarInfoComponent,
    CriarCursoComponent,
    CriarCursoOnlineComponent,
    CriarCursoPresencialComponent,
    CriarCursoRemotoComponent,
    CriarCursoEventoComponent,
    VideoComponent,
    AssinaturaComponent,
    VideoComponent,
    CardCursosRemotosComponent,
    CardCursosPresenciaisComponent,
    FacaAulasComponent,
    PesquisarComponent,
    CaixaDePesquisaComponent,
    QuizAprovadoComponent,
    QuizNaoAprovadoComponent,
    ModalAvisoComponent,
    CardTrilhaConhecimentoComponent,
    MeAviseModalComponent,
    ModulosListComponent,
    MeusCursosComponent,
    FavoritosComponent,
    CertificadosComponent,
    MeusTrabalhosComponent,
    PedidosComponent,
    CardComponent,
    NumberMaskDirective,
    CategoriasComponent,
    DialogComponent,
    EditarProfessorComponent,
    CredenciaisProfessorComponent,
    MiniCurriculoComponent,
    DadosBancariosComponent,
    EnderecoComponent,
    LoadingScreenComponent,
    QuemSomosComponent,
    QuemSomosProfessorComponent,
    VoucherComponent,
    PesquisaOpiniaoComponent,
    BibliotecaComponent,
    FieldErrorDisplayComponent,
    PerfilComponent,
    CuradorComponent,
    ValidarCertificadoComponent,
    RelatoriosGraficosComponent,
    LogotipoComponent,
    ListaEsperaComponent,
    RangeSliderComponent,
    TodosCursosComponent,
    RelatorioAlunosComponent,
    HistoricoEscolarComponent,
    HistoricoTableComponent,
    GraficoFaturamentoComparativoComponent,
    GraficoAssinaturasComponent,
    AssinaturasAtivasComponent,
    PerennialsComponent,
    PerennialsCursosOnlineComponent,
    CriarConteudoComponent,
    GraficoPedidosComponent,
    AulaLiveComponent,
    VisualizarCursoComponent,
    MeusCursosMentoriaComponent,
    RelatorioFinanceiroComponent,
    GraficoFaturamentoProfessorComponent,
    AlunoKrotonComponent,
    ListaCardCursosComponent,
    CriarCategoriaPerennialsComponent
    ],
  entryComponents: [
        MeusCursosComponent,
        FavoritosComponent,
        CertificadosComponent,
        MeusTrabalhosComponent,
        PedidosComponent,
        DialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule.forRoot(),
    RouterModule.forRoot(ROUTES, {preloadingStrategy: PreloadAllModules}),
    SlickCarouselModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatTooltipModule,
    AngularEditorModule ,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    Select2Module,
    MatTabsModule,
    MatRadioModule,
    NgxCaptchaModule,
    EmbedVideo.forRoot(),
    NgxCurrencyModule,
    SimplebarAngularModule,
    MatPaginatorModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      showInnerStroke : true

    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCyqijVqZ1GY17qPoPrERN0FiFJs8jRXGQ',
      libraries: ['places']
    }),
    Ng5SliderModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot(),
    StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
            strictStateImmutability: true,
            strictActionImmutability: true,
        }
    }),
    StoreDevtoolsModule.instrument({
        maxAge: 25,
    }),
    EffectsModule.forRoot(effects),
    CalendarModule,
    ItvModule,
  ],
  exports: [
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    BrowserModule,
    MatDialogModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatRadioModule,
  ],
  providers: [
    PermissoesGuard,
    CurrencyPipe,
    FilterPipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: LOCALE_ID, useValue: 'pt'},
    {provide: ErrorHandler, useClass: AplicationErrorHandler},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    { provide: MatPaginatorIntl, useValue: getPortuguesePaginatorIntl() },
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [ Store, ConfiguracoesStore ],
      useFactory: ( store: Store<AppState>, configuracaoStore: ConfiguracoesStore ) => {
          return () => {
            return new Promise((resolve) => {

              store.select(configuracoes).subscribe((state) => {
                  if (state.tiposCursosAtivos) {
                      configuracaoStore.updateConfiguracao(state);
                      resolve();
                  }
              });

            });
          };
      }
    }
  ],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule { }
