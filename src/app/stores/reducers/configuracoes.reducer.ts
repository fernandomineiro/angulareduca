import {Analytics, Estilo, LogoTipo, RedeSocial, Sac, TipoCurso} from '../../configuracao.model';
import {ConfiguracoesActions, ConfiguracoesActionTypes} from '../actions/configuracoes.actions';

export interface ConfiguracoesState {
    estilos: Estilo[];
    facebook: Analytics;
    ga: Analytics;
    itv: boolean;
    layoutHome: number;
    logo: LogoTipo;
    redesSociais: RedeSocial[];
    sac: Sac;
    tiposCursosAtivos: TipoCurso;
    url_logtipo: string;
}

export const initialConfiguracoesState: ConfiguracoesState = {
    estilos: null,
    facebook: null,
    ga: null,
    itv: false,
    layoutHome: 0,
    logo: null,
    redesSociais: null,
    sac: null,
    tiposCursosAtivos: null,
    url_logtipo: null,
};

export function configuracoesReducer(
    state = initialConfiguracoesState,
    action: ConfiguracoesActions
): ConfiguracoesState {
    switch (action.type) {
        case ConfiguracoesActionTypes.ConfiguracoesLoad:
            return {
                estilos: action.payload.data.estilos,
                facebook: action.payload.data.facebook,
                ga: action.payload.data.ga,
                itv: action.payload.data.itv,
                layoutHome: action.payload.data.layoutHome,
                logo: action.payload.data.logo,
                redesSociais: action.payload.data.redesSociais,
                sac: action.payload.data.sac,
                tiposCursosAtivos: action.payload.data.tiposCursosAtivos,
                url_logtipo: action.payload.data.url_logtipo
            };
        default:
            return initialConfiguracoesState;
    }
}
