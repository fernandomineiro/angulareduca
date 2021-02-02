import { Curso } from '../../../home/itv/store/itv.model';
import { CursoLiberacaoAbstract } from './curso-liberacao.abstract';
import moment from 'moment';

export class LiberacaoData extends CursoLiberacaoAbstract {

    isCursoLiberado(course: Curso): boolean {
        const dataInicio = moment(course.data_inicio);

        if (dataInicio.diff(moment(), 'minutes') <= 0) {
            return true;
        }

        return false;
    }

}
