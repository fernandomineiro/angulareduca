import { Curso } from '../../../home/itv/store/itv.model';
import { CursoLiberacaoAbstract } from './curso-liberacao.abstract';

export class LiberacaoLivre extends CursoLiberacaoAbstract {

    isCursoLiberado(course: Curso): boolean {
        return true;
    }
}
