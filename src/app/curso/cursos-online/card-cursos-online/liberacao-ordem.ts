import { Curso } from '../../../home/itv/store/itv.model';
import { CursoLiberacaoAbstract } from './curso-liberacao.abstract';

export class LiberacaoOrdem extends CursoLiberacaoAbstract {

    isCursoLiberado(course: Curso): boolean {

        const currentCourseIndex = this.courseList.findIndex(curso => {
            return curso.id === course.id;
        });

        const previousCourse = this.courseList[currentCourseIndex - 1];
        if (currentCourseIndex === 0 || previousCourse.curso_concluido) {
            return true;
        }

        return false;
    }
}
