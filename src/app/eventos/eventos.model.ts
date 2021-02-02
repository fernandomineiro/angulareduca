export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  imagem: string;
  categoria: string;
  fk_categoria: number;
  status: number;
  agendas: AgendaEventos[];
  nome_faculdade: string;
  id_faculdade: number;
}
export interface AgendaEventos {
    agenda_data_inicio: string;
    agenda_data_final: string;
    agenda_hora_inicio: string;
    agenda_hora_final: string;
    agenda_valor: string;
    agenda_status: number;
}
