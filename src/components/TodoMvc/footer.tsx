/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

import * as React from 'react';
import classNames from 'classnames';
import config from 'virtual:vite-config';
import { Button } from '@mantine/core';
import { t } from '@/utils/strings';
import { ITodoFooterProps } from './interfaces';

class TodoFooter extends React.Component<ITodoFooterProps, {}> {
  public render() {
    let clearButton = null;

    if (this.props.completedCount > 0) {
      clearButton = (
        <Button size="xs" className="clear-completed" onClick={this.props.onArchiveCompleted}>
          {t('footer.archiveCompleted')}
        </Button>
      );
    }

    const nowShowing = this.props.nowShowing;

    return (
      <footer className="footer">
        <ul className="filters">
          {config.states.map(
            ({
              id,
              hash,
              filter,
              label,
            }: {
              id: string;
              hash: string;
              filter: string;
              label: string;
            }) => (
              <li key={id}>
                <a href={hash} className={classNames({ selected: nowShowing === filter })}>
                  {label}
                </a>
              </li>
            )
          )}
        </ul>
        {clearButton}
      </footer>
    );
  }
}

export { TodoFooter };
