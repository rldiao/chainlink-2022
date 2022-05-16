import classNames from 'classnames';
import React from 'react';
import { Logo } from '../logo';
import styles from './header.module.css';

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
      <button
          className={styles.connectWalletBtn}
      >
        Connect my wallet
      </button>
    </div>
  );
};
