import * as React from 'react';
import { TodoFooter } from './footer';
import { IAppProps, IAppState, ITodo, ITodoModel } from './interfaces';
import { TodoModel } from './todoModel';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './styles.css';

import { SearchOrCreateInputBox } from '@/features/search-or-create-input-box';
import { addPrefixIfNonEmpty, getListNamespace } from '@/utils/lists';
import { TodoItemList } from '../TodoItemList';

export class TodoApp extends React.Component<IAppProps, IAppState> {
    public state: IAppState;

    private model: ITodoModel;

    private newFieldRef = React.createRef<HTMLInputElement>();

    constructor(props: IAppProps) {
        super(props);

        this.model = new TodoModel(
            addPrefixIfNonEmpty(
                getListNamespace(props.list),
                props.config.storePrefix ?? ''
            )
        );

        this.state = {
            // TODO Move default state somewhere without using specific key (`.all.`)
            nowShowing: 'all',
            editing: undefined,
            searching: '',
        };

        this.model.subscribe(this.forceUpdate.bind(this));
    }

    private getStateFromPath(location: { hash: string }): IAppState {
        const state = this.props.config.states.find(
            ({ hash }: { hash: string }) => {
                return hash === location.hash;
            }
        );

        return {
            nowShowing: state?.filter,
            searching: '',
        };
    }

    public componentDidMount() {
        this.setState(this.getStateFromPath({ hash: '#/' }));
    }

    public componentDidUpdate(prevProps: IAppProps, prevState: IAppState) {
        if (this.props.location.hash !== prevProps.location.hash) {
            // Route changed - update state
            this.setState(this.getStateFromPath(this.props.location));
        }

        if (prevState.adding && !this.state.adding) {
            this.newFieldRef.current?.focus();
        }
    }

    public handleCreate(todo: Omit<ITodo, 'id'>) {
        this.model.addTodo(todo);
        this.setState({ searching: todo.title, adding: true });

        setTimeout(() => {
            this.setState({ searching: '', adding: false });
        }, 300);
    }

    public toggleAll(event: React.FormEvent) {
        const target: any = event.target;
        const checked = target.checked;
        this.model.toggleAll(checked);
    }

    public toggle(todoToToggle: ITodo) {
        this.model.toggle(todoToToggle);
    }

    public unarchive(todo: ITodo) {
        this.model.unarchive(todo);
    }

    public destroy(todo: ITodo) {
        this.model.destroy(todo);
    }

    public edit(todo: ITodo) {
        this.setState({ editing: todo.id });
    }

    public save(todoToSave: ITodo, text: string) {
        this.model.save(todoToSave, text);
        this.setState({ editing: undefined });
    }

    public cancel() {
        this.setState({ editing: undefined });
    }

    public clearCompleted() {
        this.model.archiveCompleted();
    }

    public render() {
        let footer;
        let main;
        const todos = this.model.todos;

        const searchingLowercase = this.state.searching.toLowerCase();

        const filter = (todo: ITodo) => {
            if (searchingLowercase) {
                return todo.title?.toLowerCase()?.includes(searchingLowercase);
            }

            // TODO replace with parsing this.props.config.filters[nowShowing].value into predicate
            switch (this.state.nowShowing) {
                case 'active':
                    return !todo.completed && !todo.archived;
                case 'completed':
                    return todo.completed && !todo.archived;
                case 'archived':
                    return todo.archived;
                case 'all':
                    return !todo.archived;
                default:
                    return true;
            }
        };
        const shownTodos = todos.filter(filter);

        const sortedTodos = shownTodos.sort((a, b) => {
            if (b.title === a.title) {
                return 0;
            }

            if (b.title > a.title) {
                return -1;
            }

            return 1;
        });

        // Note: It's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why
        // we use map(), filter() and reduce() everywhere instead of mutating the
        // array or todo items themselves.
        const activeTodoCount = todos.reduce((accum, todo) => {
            return todo.completed ? accum : accum + 1;
        }, 0);

        const completedCount = todos.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer = (
                <TodoFooter
                    count={activeTodoCount}
                    completedCount={completedCount}
                    nowShowing={this.state.nowShowing}
                    onArchiveCompleted={() => this.clearCompleted()}
                />
            );
        }

        if (todos.length) {
            main = (
                <section className="main">
                    <TodoItemList todos={sortedTodos} model={this.model} />
                </section>
            );
        }

        return (
            <div>
                <SearchOrCreateInputBox
                    ref={this.newFieldRef}
                    disabled={!!this.state.adding}
                    onCreate={this.handleCreate.bind(this)}
                    value={this.state.searching}
                    onChange={this.search.bind(this)}
                    onClearInput={this.search.bind(this, {} as any)}
                    leftSection={
                        // TODO replace with batch edit feature
                        <>
                            <input
                                id="toggle-all"
                                className="toggle-all"
                                type="checkbox"
                                onChange={(e) => this.toggleAll(e)}
                                checked={activeTodoCount === 0}
                            />
                            <label htmlFor="toggle-all">
                                Mark all as complete
                            </label>
                        </>
                    }
                />
                {main}
                {footer}
            </div>
        );
    }

    public search(event: React.FormEvent) {
        const input: any = event.currentTarget;
        const searching = input?.value ?? '';

        this.setState({ searching });
    }
}
