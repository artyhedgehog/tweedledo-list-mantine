import * as React from 'react';
import { ENTER_KEY } from './constants';
import { TodoFooter } from './footer';
import { IAppProps, IAppState, ITodo, ITodoModel } from './interfaces';
import { TodoItem } from './todoItem';
import { TodoModel } from './todoModel';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './styles.css';

import config from 'virtual:vite-config';
import { CloseButton, TextInput } from '@mantine/core';
import { getListNamespace } from '@/utils/lists';
import { t } from '@/utils/strings';

export class TodoApp extends React.Component<IAppProps, IAppState> {
  public state: IAppState;

  private model: ITodoModel;

  constructor(props: IAppProps) {
    super(props);

    this.model = new TodoModel(getListNamespace(props.list));

    this.state = {
      // TODO Move default state somewhere without using specific key (`.all.`)
      nowShowing: 'all',
      editing: undefined,
      searching: '',
    };

    this.model.subscribe(this.forceUpdate.bind(this));
  }

  private getStateFromPath(location: { hash: string }): IAppState {
    const state = config.states.find(({ hash }: { hash: string }) => {
      return hash === location.hash;
    });

    return {
      nowShowing: state.filter,
      searching: '',
    };
  }

  public componentDidMount() {
    this.setState(this.getStateFromPath({ hash: '#/' }));
  }

  public componentDidUpdate(prevProps: IAppProps) {
    if (this.props.location.hash !== prevProps.location.hash) {
      // Route changed - update state
      this.setState(this.getStateFromPath(this.props.location));
    }
  }

  public handleNewTodoKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const val = this.state.searching.trim();

    if (val) {
      this.model.addTodo(val);
      this.setState({ adding: true });

      setTimeout(() => {
        this.setState({ searching: '', adding: false });
      }, 400);
    }
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

    const filter = (todo: ITodo) => {
      if (this.state.searching) {
        return todo.title.includes(this.state.searching);
      }

      // TODO replace with parsing config.filters[nowShowing].value into predicate
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

    const todoItems = sortedTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
          onUnarchive={this.unarchive.bind(this, todo)}
          onDestroy={this.destroy.bind(this, todo)}
          onEdit={this.edit.bind(this, todo)}
          editing={this.state.editing === todo.id}
          onSave={this.save.bind(this, todo)}
          onCancel={() => this.cancel()}
        />
      );
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
          <ul className="todo-list">{todoItems}</ul>
        </section>
      );
    }

    return (
      <div>
        <div className="header">
          <TextInput
            disabled={this.state.adding}
            variant="unstyled"
            className="search-bar"
            placeholder={t('searchBar.placeholder')}
            onKeyDown={(e) => this.handleNewTodoKeyDown(e)}
            value={this.state.searching}
            onChange={this.search.bind(this)}
            leftSection={
              <>
                <input
                  id="toggle-all"
                  className="toggle-all"
                  type="checkbox"
                  onChange={(e) => this.toggleAll(e)}
                  checked={activeTodoCount === 0}
                />
                <label htmlFor="toggle-all">Mark all as complete</label>
              </>
            }
            rightSection={
              this.state.searching ? (
                <CloseButton onClick={this.search.bind(this, {} as any)} />
              ) : undefined
            }
            size="xl"
            autoFocus
          />
        </div>
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
