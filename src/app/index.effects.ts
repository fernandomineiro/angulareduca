import { LoginEffects } from './security/login/store/login.effects';
import { ConfiguracoesEffects } from './stores/effects/configuracoes.effects';
import { HomeEffects } from './home/store/home.effects';

export const effects = [
    LoginEffects,
    ConfiguracoesEffects,
    HomeEffects
];
