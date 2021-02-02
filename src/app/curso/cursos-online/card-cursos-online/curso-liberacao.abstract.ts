import { Curso } from 'src/app/home/itv/store/itv.model';
import { of } from 'rxjs';

export abstract class CursoLiberacaoAbstract {

    courseList;
    message = of('');

    abstract isCursoLiberado(course: Curso): boolean;

    setCourseList(list) {
        this.courseList = list;
        return this;
    }
}
