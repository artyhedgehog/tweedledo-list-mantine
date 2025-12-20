import * as React from 'react';
import { ACTIVE_TODOS, ALL_TODOS, COMPLETED_TODOS, ENTER_KEY } from './constants';
import { TodoFooter } from './footer';
import { IAppProps, IAppState, ITodo, ITodoModel } from './interfaces';
import { TodoItem } from './todoItem';
import { TodoModel } from './todoModel';

import 'todomvc-common/base.css';
import 'todomvc-app-css/index.css';
import './styles.css';

export class TodoApp extends React.Component<IAppProps, IAppState> {
  public state: IAppState;

  private model: ITodoModel;

  private newFieldRef?: HTMLInputElement | null;

  constructor(props: IAppProps) {
    super(props);

    this.model = new TodoModel('react-todos');

    this.state = {
      nowShowing: ALL_TODOS,
      editing: undefined,
    };

    this.model.subscribe(this.forceUpdate.bind(this));
  }

  private getStateFromPath(path: string): IAppState {
    switch (path) {
      case '/':
        return { nowShowing: ALL_TODOS };
      case '/active':
        return { nowShowing: ACTIVE_TODOS };
      case '/completed':
        return { nowShowing: COMPLETED_TODOS };
    }

    return {};
  }

  public componentDidMount() {
    this.setState(this.getStateFromPath('/'));
  }

  public componentDidUpdate(prevProps: IAppProps) {
    const path = this.props.location.pathname;
    if (path !== prevProps.location.pathname) {
      // Route changed - update state
      this.setState(this.getStateFromPath(path));
      console.log('Route changed:', path);
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
    this.model.clearCompleted();
  }

  public render() {
    let footer;
    let main;
    const todos = this.model.todos;

    const shownTodos = todos.filter((todo) => {
      switch (this.state.nowShowing) {
        case ACTIVE_TODOS:
          return !todo.completed;
        case COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });

    const todoItems = shownTodos.map((todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={this.toggle.bind(this, todo)}
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
          onClearCompleted={() => this.clearCompleted()}
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
        <header className="header">
          <h1>todos</h1>
          <input
            ref={(node) => {
              this.newFieldRef = node;
            }}
            className="new-todo"
            placeholder="What needs to be done?"
            onKeyDown={(e) => this.handleNewTodoKeyDown(e)}
            autoFocus
          />
        </header>
        {main}
        {footer}
      </div>
    );
  }
}
