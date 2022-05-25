import { useWeb3React } from '@web3-react/core';
import classNames from 'classnames';
import React from 'react';
import { Logo } from '../logo';
import styles from './header.module.css';

export const Header = () => {
  const { active, account } = useWeb3React();

  const buttonText = active ? account : 'Connect my wallet';

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
      {/* TODO(shevon): Update to use button that will link to /connect, or make connect a modal */}
      <button
          className={styles.connectWalletBtn}
      >
        { buttonText }
      </button>
    </div>
  );
};
