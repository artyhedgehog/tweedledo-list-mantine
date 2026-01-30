/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

import { ITodo, ITodoModel, NotificationCallback } from './interfaces';
import { Utils } from './utils';

// Generic "model" object. You can use whatever
// framework you want. For this application it
// may not even be worth separating this logic
// out, but we do this to demonstrate one way to
// separate out parts of your application.
class TodoModel implements ITodoModel {
  public key: string;
  public todos: Array<ITodo>;
  public onChanges: Array<NotificationCallback>;

  constructor(key: string) {
    this.key = key;
    this.todos = Utils.getValue(key);
    this.onChanges = [];
  }

  public subscribe(onChange: NotificationCallback) {
    this.onChanges.push(onChange);
  }

  public inform() {
    Utils.setValue(this.key, this.todos);
    this.onChanges.forEach((cb) => {
      cb();
    });
  }

  public addTodo(title: string) {
    this.todos = this.todos.concat({
      id: Utils.uuid(),
      title,
      completed: false,
    });

    this.inform();
  }

  public toggleAll(checked: boolean) {
    // Note: It's usually better to use immutable data structures since they're
    // easier to reason about and React works very well with them. That's why
    // we use map(), filter() and reduce() everywhere instead of mutating the
    // array or todo items themselves.
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return Utils.extend({}, todo, { completed: checked });
    });

    this.inform();
  }

  public toggle(todoToToggle: ITodo) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return todo !== todoToToggle ? todo : Utils.extend({}, todo, { completed: !todo.completed });
    });

    this.inform();
  }

  public unarchive(todoToUnarchive: ITodo) {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return todo !== todoToUnarchive ? todo : Utils.extend({}, todo, { archived: false });
    });

    this.inform();
  }

  public destroy(todo: ITodo) {
    this.todos = this.todos.filter((candidate) => {
      return candidate !== todo;
    });

    this.inform();
  }

  public save(todoToSave: ITodo, text: string) {
    this.todos = this.todos.map((todo) => {
      return todo !== todoToSave ? todo : Utils.extend({}, todo, { title: text });
    });

    this.inform();
  }

  public archiveCompleted() {
    this.todos = this.todos.map<ITodo>((todo: ITodo) => {
      return todo.completed ? Utils.extend({}, todo, { completed: false, archived: true }) : todo;
    });

    this.inform();
  }

  public destroyCompleted() {
    this.todos = this.todos.filter((todo) => {
      return !todo.completed;
    });

    this.inform();
  }

  public destroyArchived() {
    this.todos = this.todos.filter((todo) => {
      return !todo.archived;
    });

    this.inform();
  }
}

export { TodoModel };
