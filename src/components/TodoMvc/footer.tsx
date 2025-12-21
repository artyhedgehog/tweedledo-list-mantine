/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

import * as React from 'react';
import classNames from 'classnames';
import { Button } from '@mantine/core';
import { routing } from '@/routing';
import { ACTIVE_TODOS, ALL_TODOS, ARCHIVED_TODOS, COMPLETED_TODOS } from './constants';
import { ITodoFooterProps } from './interfaces';
import { Utils } from './utils';

class TodoFooter extends React.Component<ITodoFooterProps, {}> {
  public render() {
    const activeTodoWord = Utils.pluralize(this.props.count, 'item');
    let clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <Button size="xs" className="clear-completed" onClick={this.props.onArchiveCompleted}>
          Check out
        </Button>
      );
    }

    const nowShowing = this.props.nowShowing;
    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{this.props.count}</strong> {activeTodoWord} left
        </span>
        <ul className="filters">
          <li>
            <a
              href={routing.todos.archived.href}
              className={classNames({ selected: nowShowing === ARCHIVED_TODOS })}
            >
              In stock
            </a>
          </li>{' '}
          <li>
            <a
              href={routing.todos.all.href}
              className={classNames({ selected: nowShowing === ALL_TODOS })}
            >
              Shop
            </a>
          </li>{' '}
          <li>
            <a
              href={routing.todos.active.href}
              className={classNames({ selected: nowShowing === ACTIVE_TODOS })}
            >
              To buy
            </a>
          </li>{' '}
          <li>
            <a
              href={routing.todos.completed.href}
              className={classNames({ selected: nowShowing === COMPLETED_TODOS })}
            >
              Cart
            </a>
          </li>
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };
