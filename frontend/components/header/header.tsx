import React from 'react';
import styles from './header.module.css';
import classNames from 'classnames';
import { Logo } from '../logo';

export const Header = () => {
  return (
    <div
        className={styles.header}
    >
      <Logo/>
      <ul
        className={styles.menu}
      >
        <li 
          className={classNames(styles.link, styles.active)}
        >
          Home
        </li>
        <li 
          className={styles.link}
        >
          Tournaments
        </li>
        <li 
          className={styles.link}
        >
          More
        </li>
      </ul>
    </div>
  )
};
