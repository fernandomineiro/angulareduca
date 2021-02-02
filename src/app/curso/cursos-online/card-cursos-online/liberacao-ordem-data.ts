import { Curso} from '../../../home/itv/store/itv.model';
import { CursoLiberacaoAbstract } from './curso-liberacao.abstract';
import { LiberacaoOrdem } from './liberacao-ordem';
import { LiberacaoData } from './liberacao-data';

export class LiberacaoOrdemData extends CursoLiberacaoAbstract {

    isCursoLiberado(course: Curso): boolean {
        return (new LiberacaoOrdem()).setCourseList(this.courseList).isCursoLiberado(course) &&
            (new LiberacaoData()).setCourseList(this.courseList).isCursoLiberado(course);
    }

}
