export class State {
    private static instance: State;

    static getInstance() {
        if (!State.instance) {
            State.instance = new State();
        }

        return State.instance;
    }
}
