import { Observable, BehaviorSubject } from 'rxjs';

export class Store<T> {
    state$: Observable<T>;
    // tslint:disable-next-line:variable-name
    private _state$: BehaviorSubject<T>;

    // @ts-ignore
    constructor(initialState: T) {
        this._state$ = new BehaviorSubject<T>(initialState);
        this.state$ = this._state$.asObservable();
    }

    // @ts-ignore
    get state(): T {
        return this._state$.getValue();
    }

    // @ts-ignore
    setState(nextState: T): void {
        this._state$.next(nextState);
    }
}
