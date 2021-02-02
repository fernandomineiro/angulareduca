import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ADDRESS_API, ApiResponse } from 'src/app/app.api';

@Injectable({
  providedIn: 'root'
})
export class AcessoRestritoSidebarService {

  constructor(private http: HttpClient) { }
  getRelatoriosAluno(query): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/alunos${query}`);
  }
  getRelatoriosAlunoExport(query): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/alunos${query}`, {
      'responseType': 'application/*' as 'json'
    });
  }

  getTutoriaUnreadMessages(id): Observable<any> {
    return this.http.get<any>(`${ADDRESS_API}/api/tutoria/${id}/nao-lidas`);
  }
  getTiposFormacao(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/professor-tipos-formacao`);
  }
  getHistoricoEscolas(identif):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/historico-escolar/${identif}`);
  }
  getGraficoFaturamentoComparativo(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/grafico-comparativo-faturamento${query}`);
  }
  getGraficoFaturamentoProfessor(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/grafico-faturamento-por-professor${query}`);
  }
  getGraficoAssinaturasRealizadas(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/assinaturas-realizadas${query}`); 
  }
  getGraficoAssinaturasAbandonadas(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/assinaturas-abandonadas${query}`); 
  }
  getGraficoAssinantesAtivos(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/assinantes-ativos${query}`);  
  }
  getGraficoAssinaturasCanceladas(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/assinaturas-canceladas${query}`); 
  }
  getGraficoPedidosPagamentoReprovado(query):Observable<ApiResponse>{
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/pedidos-pagamento-reprovados${query}`);
  }

  carregarFiltrosRelatorioFinanceiro(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/relatorio-financeiro/carregar-filtros`);
  }

  getRelatorioFinanceiro(filters: object = {}): Observable<ApiResponse> {
    let params = new HttpParams();

    Object.keys(filters).forEach(filter => {
      params = params.append(filter, filters[filter]);
    });

    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/relatorio-financeiro`, { params });
  }

  exportarRelatorioFinanceiro(filters: object = {}): Observable<ApiResponse> {
    let params = new HttpParams();

    Object.keys(filters).forEach(filter => {
      params = params.append(filter, filters[filter]);
    });

    return this.http.get<ApiResponse>(`${ADDRESS_API}/api/relatorios/relatorio-financeiro/exportar`, { 
      params,
      responseType: 'blob' as 'json'
    });
  }
}
