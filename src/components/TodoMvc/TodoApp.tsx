import * as React from 'react';
import { ACTIVE_TODOS, ALL_TODOS, ARCHIVED_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { TodoFooter } from './footer';
import { IAppProps, IAppState, ITodo, ITodoModel } from './interfaces';
import { TodoItem } from './todoItem';
import { TodoModel } from './todoModel';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './styles.css';

import { routing } from '@/routing';
import { getListNamespace } from '@/utils/lists';
import { t } from '@/utils/strings';

export class TodoApp extends React.Component<IAppProps, IAppState> {
  public state: IAppState;

  private model: ITodoModel;

  private newFieldRef?: HTMLInputElement | null;

  constructor(props: IAppProps) {
    super(props);

    this.model = new TodoModel(getListNamespace(props.list));

    this.state = {
      nowShowing: ALL_TODOS,
      editing: undefined,
    };

    this.model.subscribe(this.forceUpdate.bind(this));
  }

  private getStateFromPath({ hash }: { hash: string }): IAppState {
    switch (hash) {
      case routing.todos.all.hash:
        return { nowShowing: ALL_TODOS };
      case routing.todos.active.hash:
        return { nowShowing: ACTIVE_TODOS };
      case routing.todos.completed.hash:
        return { nowShowing: COMPLETED_TODOS };
      case routing.todos.archived.hash:
        return { nowShowing: ARCHIVED_TODOS };
    }

    return {};
  }

  public componentDidMount() {
    this.setState(this.getStateFromPath(routing.todos.all));
  }

  public componentDidUpdate(prevProps: IAppProps) {
    if (this.props.location.hash !== prevProps.location.hash) {
      // Route changed - update state
      this.setState(this.getStateFromPath(this.props.location));
      console.log('Route changed: ', this.props.location.hash);
    }
  }

  public handleNewTodoKeyDown(event: React.KeyboardEvent) {
    if (event.keyCode !== ENTER_KEY) {
      return;
    }

    event.preventDefault();

    const node = this.newFieldRef;

    if (!node) {
      return;
    }

    const val = node.value.trim();

    if (val) {
      this.model.addTodo(val);
      node.value = '';
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

    const shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed && !todo.archived;
        case COMPLETED_TODOS:
          return todo.completed && !todo.archived;
        case ARCHIVED_TODOS:
          return todo.archived;
        case ALL_TODOS:
          return !todo.archived;
        default:
          return true;
      }
    });

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
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            onChange={(e) => this.toggleAll(e)}
            checked={activeTodoCount === 0}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">{todoItems}</ul>
        </section>
      );
    }

    return (
      <div>
        <div className="header">
          <input
            ref={(node) => {
              this.newFieldRef = node;
            }}
            className="new-todo"
            placeholder={t('searchBar.placeholder')}
            onKeyDown={(e) => this.handleNewTodoKeyDown(e)}
            autoFocus
          />
        </div>
        {main}
        {footer}
      </div>
    );
  }
}
