/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */

import * as React from 'react';
import classNames from 'classnames';
import { Button } from '@mantine/core';
import { useConfig } from '@/hooks/use-config';
import { useI18n } from '@/utils/strings';
import { ITodoFooterProps } from './interfaces';

export function TodoFooter(props: ITodoFooterProps) {
  const { config } = useConfig();
  const { t } = useI18n();

  let clearButton = null;

  if (props.completedCount > 0) {
    clearButton = (
      <Button size="xs" className="clear-completed" onClick={props.onArchiveCompleted}>
        {t('footer.archiveCompleted')}
      </Button>
    );
  }

  const nowShowing = props.nowShowing;

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
