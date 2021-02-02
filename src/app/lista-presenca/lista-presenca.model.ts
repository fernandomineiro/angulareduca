export interface ListaPresenca {
    courseId: string;
    courseName: string;
    turmas: {
        agenda: {
            id: number
            nome: string
            descricao: string
            data: string
            status: number
            criacao: string
            atualizacao: string
        }
    };
    place: string;
    selectedAgenda: string;
    panelOpenState: boolean;
    currentListStudents: {
        id: number
        nome: string
    };
    currentAgendaId: number;
  }
