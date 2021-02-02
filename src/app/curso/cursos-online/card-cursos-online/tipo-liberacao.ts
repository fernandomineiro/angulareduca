// generated, we cannot modify it :(
import { CursoLiberacaoAbstract } from './curso-liberacao.abstract';
import { LiberacaoLivre } from './liberacao-livre';
import { LiberacaoData } from './liberacao-data';
import { LiberacaoOrdem } from './liberacao-ordem';
import { LiberacaoOrdemData } from './liberacao-ordem-data';

export enum GeneratedTipoLiberacao {
    LIVRE = 1, /* livre */
    DATA = 2, /* por data */
    ORDEM = 3, /* por ordem */
    ORDEMDATA = 4, /* por ordem e data */
}

export class TipoLiberacao {
    static LIVRE = new TipoLiberacao(GeneratedTipoLiberacao.LIVRE, new LiberacaoLivre(), 'LIVRE');
    static DATA = new TipoLiberacao(GeneratedTipoLiberacao.DATA, new LiberacaoData(), 'DATA');
    static ORDEM = new TipoLiberacao(GeneratedTipoLiberacao.ORDEM, new LiberacaoOrdem(), 'ORDEM');
    static ORDEMDATA = new TipoLiberacao(GeneratedTipoLiberacao.ORDEMDATA, new LiberacaoOrdemData(), 'ORDEMDATA');
    static indicators = [TipoLiberacao.LIVRE, TipoLiberacao.DATA, TipoLiberacao.ORDEM, TipoLiberacao.ORDEMDATA];

    readonly generated: GeneratedTipoLiberacao;
    readonly liberacao: CursoLiberacaoAbstract;
    readonly type: string;

    constructor(
        generated: GeneratedTipoLiberacao,
        liberacao: CursoLiberacaoAbstract,
        type: string
    ) {
        this.generated = generated;
        this.liberacao = liberacao;
        this.type = type;
    }

    static of = (generated: GeneratedTipoLiberacao): TipoLiberacao =>
        TipoLiberacao.indicators.find(indicator => indicator.generated === generated);
}
