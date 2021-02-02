// tslint:disable: max-line-length
import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { AcessoRestritoComponent } from './acesso-restrito/acesso-restrito.component';

import { NotFoundComponent } from './not-found/not-found.component'
import { CursosOnlineComponent } from './curso/cursos-online/cursos-online.component';
import { CursosPresenciaisComponent } from './curso/cursos-presenciais/cursos-presenciais.component';
import { CursosRemotosComponent } from './curso/cursos-remotos/cursos-remotos.component';

import { TrilhaConhecimentoComponent } from 'src/app/trilha-conhecimento/trilha-conhecimento.component';
import { DetalheCursoOnlineComponent } from './curso/cursos-online/detalhe-curso-online.component';
import { DetalheCursoPresencialComponent } from './curso/cursos-presenciais/detalhe-curso-presencial.component';
import { DetalheCursoRemotoComponent } from './curso/cursos-remotos/detalhe-curso-remoto.component';

import { CategoriaCursosOnlineComponent } from './curso/cursos-online/categoria-cursos-online.component';
import { CategoriaCursosPresenciaisComponent } from './curso/cursos-presenciais/categoria-cursos-presenciais.component';
import { CategoriaCursosRemotosComponent } from './curso/cursos-remotos/categoria-cursos-remotos.component';

import { EventosComponent } from './eventos/eventos.component';
import { DetalheEventoComponent } from './eventos/detalhe-evento.component';
import { CategoriaEventosComponent } from './eventos/categoria-eventos.component';
import { MeusEventosComponent } from './eventos/meus-eventos/meus-eventos.component';

import { CategoriaTrilhaConhecimentoComponent } from 'src/app/trilha-conhecimento/categoria-trilha-conhecimento/categoria-trilha-conhecimento.component';
import { SobreTrilhaConhecimentoComponent } from 'src/app/trilha-conhecimento/sobre-trilha-conhecimento/sobre-trilha-conhecimento.component';

import { ProfessorComponent } from 'src/app/professor/professor.component';
import { ProfessorSobreComponent } from 'src/app/professor/professor-sobre.component';
import { ProfessorCategoriaComponent } from 'src/app/professor/professor-categoria.component';
import { SejaProfessorComponent } from 'src/app/professor/seja-professor/seja-professor.component';
import { TutoriaTrabalhosComponent } from 'src/app/tutoria/tutoria-trabalhos/tutoria-trabalhos.component';
import { TutoriaMensagensComponent } from 'src/app/tutoria/tutoria-mensagens/tutoria-mensagens.component';
import { TutoriaChatComponent } from 'src/app/tutoria/tutoria-chat/tutoria-chat.component';
import { ListaPresencaComponent } from 'src/app/lista-presenca/lista-presenca.component';
import { ListaEsperaComponent } from 'src/app/lista-espera/lista-espera.component';

import { EditarComponent } from 'src/app/acesso-restrito/perfil/editar/editar.component';
import { AlunoAcessoRestritoComponent } from 'src/app/aluno/acesso-restrito/acesso-restrito.component';
import { CadastroComponent } from 'src/app/aluno/cadastro/cadastro.component';
import { ShoppingCartComponent } from 'src/app/shopping-cart/shopping-cart.component';
import { PaymentComponent } from 'src/app/shopping-cart/payment/payment.component';
import { ThanksComponent } from 'src/app/shopping-cart/thanks/thanks.component';
import { LoginComponent } from './security/login/login.component';
import { LoggedInGuard } from './security/loggedin.guard'
import { CursosSugestaoComponent } from 'src/app/curso/cursos-sugestao/cursos-sugestao.component';
import { DisparadorEmailsComponent } from 'src/app/disparador-emails/disparador-emails.component';
import { AgendaCursosComponent } from './agenda/agenda-cursos/agenda-cursos.component';
import { AgendaComponent } from './agenda/agenda.component';
import { AgendaGravacaoComponent } from './agenda/agenda-gravacao/agenda-gravacao.component';
import { StatusAprovacaoComponent } from './status-aprovacao/status-aprovacao.component';
import { AprovacaoFixesComponent } from './status-aprovacao/aprovacao-fixes/aprovacao-fixes.component';
import { FaqComponent } from './faq/faq.component';
import { PoliticaComponent } from './politica-termos/politica/politica.component';
import { TermosComponent } from './politica-termos/termos/termos.component';

import { MeuCursoComponent } from './aluno/cursando/meu-curso/meu-curso.component';
import { VideoComponent } from './aluno/cursando/video/video.component';

import { QuestionarioComponent } from './aluno/cursando/questionario/questionario.component';
import { ResultadoComponent } from './aluno/cursando/resultado/resultado.component'

import { ProfessorMeusCursosOnlineComponent } from './professor/meus-cursos/online/online.component';
import { ProfessorMeusCursosPresencialComponent } from './professor/meus-cursos/presencial/presencial.component';
import { ProfessorMeusCursosRemotoComponent } from './professor/meus-cursos/remoto/remoto.component';
import { DuvidasComponent } from './aluno/cursando/duvidas/duvidas.component';
import { CriarCursoComponent } from './professor/criar-curso/criar-curso.component';
import { CriarCursoOnlineComponent } from './professor/criar-curso/criar-curso-online/criar-curso-online.component';
import { CriarCursoPresencialComponent } from 'src/app/professor/criar-curso/criar-curso-presencial/criar-curso-presencial.component';
import { CriarCursoRemotoComponent } from 'src/app/professor/criar-curso/criar-curso-remoto/criar-curso-remoto.component';
import { CriarCursoEventoComponent } from 'src/app/professor/criar-curso/criar-curso-evento/criar-curso-evento.component';
import {AssinaturaComponent} from './assinaturas/assinatura.component';
import { FacaAulasComponent } from 'src/app/aluno/cursando/faca-aulas/faca-aulas.component';

import { PesquisarComponent } from './pesquisar/pesquisar.component';

import { QuizAprovadoComponent } from './quiz-aprovado/quiz-aprovado.component';
import { QuizNaoAprovadoComponent } from './quiz-nao-aprovado/quiz-nao-aprovado.component';
import { CategoriasComponent } from 'src/app/curso/categorias/categorias.component';
import { MeusCursosComponent } from 'src/app/aluno/acesso-restrito/meus-cursos/meus-cursos.component';
import { FavoritosComponent } from 'src/app/aluno/acesso-restrito/favoritos/favoritos.component';
import { MeusTrabalhosComponent } from 'src/app/aluno/acesso-restrito/meus-trabalhos/meus-trabalhos.component';
import { CertificadosComponent } from 'src/app/aluno/acesso-restrito/certificados/certificados.component';
import { PedidosComponent } from 'src/app/aluno/acesso-restrito/pedidos/pedidos.component';
import {EditarProfessorComponent} from './professor/editar/editar-professor.component';
import {CredenciaisProfessorComponent} from './professor/editar/credenciais/credenciais-professor.component';
import {MiniCurriculoComponent} from './professor/editar/mini-curriculo/mini-curriculo.component';
import {DadosBancariosComponent} from './professor/editar/dados-bancarios/dados-bancarios.component';
import {EnderecoComponent} from './professor/editar/endereco/endereco.component';
import { QuemSomosComponent } from 'src/app/quem-somos/quem-somos.component';
import { QuemSomosProfessorComponent } from 'src/app/quem-somos/professor/professor.component';
import { VoucherComponent } from 'src/app/aluno/acesso-restrito/voucher/voucher.component';
import { PesquisaOpiniaoComponent } from 'src/app/professor/pesquisa-opiniao/pesquisa-opiniao.component';
import { BibliotecaComponent } from 'src/app/biblioteca/biblioteca.component';
import { ValidarCertificadoComponent } from 'src/app/validar-certificado/validar-certificado.component';
import { RelatoriosGraficosComponent } from 'src/app/professor/relatorios-graficos/relatorios-graficos.component';
import { TodosCursosComponent } from 'src/app/curso/todos-cursos/todos-cursos.component';
import { RelatorioAlunosComponent } from 'src/app/acesso-restrito/relatorio-alunos/relatorio-alunos.component';
import { HistoricoEscolarComponent } from 'src/app/acesso-restrito/historico-escolar/historico-escolar.component';
import { GraficoFaturamentoComparativoComponent } from 'src/app/acesso-restrito/graficos/grafico-faturamento-comparativo/grafico-faturamento-comparativo.component';
import { GraficoAssinaturasComponent } from 'src/app/acesso-restrito/graficos/grafico-assinaturas/grafico-assinaturas.component';
import { CriarConteudoComponent } from 'src/app/home/perennials/criar-conteudo/criar-conteudo.component';
import { GraficoPedidosComponent } from 'src/app/acesso-restrito/graficos/grafico-pedidos/grafico-pedidos.component';
import { AulaLiveComponent } from 'src/app/aluno/cursando/aula-live/aula-live.component';
import { VisualizarCursoComponent } from 'src/app/home/perennials/visualizar-curso/visualizar-curso.component';
import { MeusCursosMentoriaComponent } from 'src/app/home/perennials/meus-cursos-mentoria/meus-cursos-mentoria.component';
import { PermissoesGuard } from './permissoes/permissoes.guard';
import { RelatorioFinanceiroComponent } from './acesso-restrito/relatorio-financeiro/relatorio-financeiro.component';
import { GraficoFaturamentoProfessorComponent } from 'src/app/acesso-restrito/graficos/grafico-faturamento-professor/grafico-faturamento-professor.component';

import { AlunoKrotonComponent } from './aluno/aluno-kroton/aluno-kroton.component';
import { CriarCategoriaPerennialsComponent } from 'src/app/home/perennials/criar-conteudo/criar-categoria-perennials/criar-categoria-perennials.component';
import {CalendarComponent} from "./calendar/calendar.component";

export const ROUTES: Routes = [
  {path: '', component: HomeComponent},

  {path: 'calendario', component: CalendarComponent},
  {path: 'cursos-online', component: CursosOnlineComponent},
  {path: 'cursos-presenciais', component: CursosPresenciaisComponent},
  {path: 'cursos-remotos', component: CursosRemotosComponent},

  {path: 'curso-online/:id/detalhe', component: DetalheCursoOnlineComponent},
  {path: 'curso-presencial/:id/detalhe', component: DetalheCursoPresencialComponent},
  {path: 'curso-remoto/:id/detalhe', component: DetalheCursoRemotoComponent},

  {path: 'cursos-online/:id/categoria', component: CategoriaCursosOnlineComponent},
  {path: 'cursos-remotos/:id/categoria', component: CategoriaCursosRemotosComponent},
  {path: 'cursos-presenciais/:id/categoria', component: CategoriaCursosPresenciaisComponent},
  {path: 'cursos-categoria/:id', component: CategoriasComponent},
  {path: 'cursos-categoria/:slug_categoria', component: CategoriasComponent},

  {path: 'todos-os-cursos/:tipo', component: TodosCursosComponent},
  {path: 'todos-os-cursos/:tipo/:classif', component: TodosCursosComponent},

  {path: 'trilhas-conhecimento', component: TrilhaConhecimentoComponent},
  {path: 'trilha-lista/:id', component: CategoriaTrilhaConhecimentoComponent},
  {path: 'trilha-sobre/:id', component: SobreTrilhaConhecimentoComponent},


  {path: 'assinaturas', component: AssinaturaComponent},

  {path: 'login/:to', component: LoginComponent},
  {path: 'login', component: LoginComponent},
  {path: 'kroton-login', component: AlunoKrotonComponent},
  {path: 'acesso-restrito', component: AcessoRestritoComponent},
  {path: 'acesso-restrito/pesquisa-opiniao', component: PesquisaOpiniaoComponent},
  
  {path: 'acesso-restrito/graficos/faturamento-comparativo', component: RelatorioFinanceiroComponent, canActivate: [PermissoesGuard]},
  {path: 'acesso-restrito/graficos/assinaturas', component: GraficoAssinaturasComponent},
  {path: 'acesso-restrito/graficos/pedidos', component: GraficoPedidosComponent},
  {path: 'acesso-restrito/relatorios/alunos', component: RelatorioAlunosComponent},
  {path: 'acesso-restrito/relatorios', component: RelatoriosGraficosComponent},
  {path:'acesso-restrito/relatorios/historico-escolar', component:HistoricoEscolarComponent},
  {path:'acesso-restrito/criar-conteudo', component:CriarConteudoComponent},
  {path:'acesso-restrito/criar-conteudo/visualizar', component:VisualizarCursoComponent},
  {path:'acesso-restrito/criar-categoria-mentoria', component:CriarCategoriaPerennialsComponent},
  {path:'acesso-restrito/conteudo/meus-cursos', component:MeusCursosMentoriaComponent},
  {path:'acesso-restrito/relatorios/historico-escolar', component: HistoricoEscolarComponent},
  {path:'acesso-restrito/graficos/faturamento-por-professor', component: GraficoFaturamentoProfessorComponent},
  {path: 'eventos', component: EventosComponent},
  {path: 'evento/:id/detalhe', component: DetalheEventoComponent},
  {path: 'evento/:id/categoria', component: CategoriaEventosComponent},
  {path: 'meus-eventos', component: MeusEventosComponent},

  {path: 'professores', component: ProfessorComponent },
  {path: 'professor/:id', component: ProfessorSobreComponent },
  {path: 'acesso-restrito/perfil',
    children: [
      { path: '', component: EditarProfessorComponent },
      { path: 'credenciais', component: CredenciaisProfessorComponent },
      { path: 'mini-curriculo', component: MiniCurriculoComponent },
      { path: 'dados-bancarios', component: DadosBancariosComponent },
      { path: 'endereco', component: EnderecoComponent },
    ]
  },
  {path: 'professores-categoria', component: ProfessorCategoriaComponent },
  {path: 'professores-categoria/:id', component: ProfessorCategoriaComponent },
  {path: 'professores-meus-cursos-online', component: ProfessorMeusCursosOnlineComponent },
  {path: 'professores-meus-cursos-presencial', component: ProfessorMeusCursosPresencialComponent },
  {path: 'professores-meus-cursos-hidrido', component: ProfessorMeusCursosRemotoComponent },

  
  {path: 'perfil', component: AlunoAcessoRestritoComponent, 
  children: [
    {path: 'cursos', component: MeusCursosComponent},
    {path: 'favoritos', component: FavoritosComponent},
    {path: 'trabalhos', component: MeusTrabalhosComponent},
    {path: 'certificados', component: CertificadosComponent},
    {path: 'pedidos', component: PedidosComponent},
    
  ]},
  {path: 'editar', component: EditarComponent},
  {path: 'carrinho', component: ShoppingCartComponent},
  {path: 'pagamento/:passo', component: PaymentComponent},
  {path: 'pagamento', component: PaymentComponent},
  {path: 'seja-um-professor', component:SejaProfessorComponent},
  {path: 'pedido-concluido/:id', component: ThanksComponent},
  
  {path: 'sugestoes', component:CursosSugestaoComponent},

  {path: 'tutoria-trabalhos', component:TutoriaTrabalhosComponent},
  {path: 'tutoria-mensagens', component:TutoriaMensagensComponent},
  {path: 'tutoria-chat/:id', component:TutoriaChatComponent},

  {path:'lista-presenca',component:ListaPresencaComponent},
  {path:'lista-espera',component:ListaEsperaComponent},

  {path: 'disparador-emails', component:DisparadorEmailsComponent},

  {path:'agenda-cursos', component:AgendaCursosComponent},
  {path:'agenda-gravacao', component:AgendaGravacaoComponent},

  {path: 'status-aprovacao', component:StatusAprovacaoComponent},
  {path: 'aprovacao-ajustes/:id', component: AprovacaoFixesComponent },

  {path: 'faq', component: FaqComponent},
  {path: 'meu-curso/:id', component: MeuCursoComponent,
    children: [
      {path: 'duvidas', component: DuvidasComponent},
      {path: 'faca-aulas', component: FacaAulasComponent},
      {path: 'voucher', component: VoucherComponent},
      {path: 'questionario/:idQuiz', component: QuestionarioComponent}
    ]
  },
  {path: 'quiz-aprovado', component: QuizAprovadoComponent},
  {path: 'quiz-nao-aprovado', component: QuizNaoAprovadoComponent},  
  {path: 'video/:idCurso/:idModulo', component: VideoComponent},
  {path: 'video-ao-vivo/:idCurso/:idModulo', component: AulaLiveComponent},  

  {path:'politica-privacidade', component:PoliticaComponent},
  {path: 'termos-condicoes', component:TermosComponent},

  {path:'criar-curso', component:CriarCursoComponent},
  {path:'criar-curso-online', component:CriarCursoOnlineComponent},
  {path:'criar-curso-presencial', component:CriarCursoPresencialComponent},
  {path:'criar-curso-remoto', component:CriarCursoRemotoComponent},

    // {path:'criar-evento', component:CriarCursoEventoComponent},

  {path:`pesquisar`, component:PesquisarComponent},
  {path: 'biblioteca', component: BibliotecaComponent},

  {path: 'autenticar-certificado', component: ValidarCertificadoComponent},

  {path:`quem-somos`, component:QuemSomosComponent},
  {path: 'quem-somos-professor', component: QuemSomosProfessorComponent},
  {path: '**', component: NotFoundComponent}
 


]
