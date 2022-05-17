import type { NextPage } from 'next';
import React from 'react';
import { Header } from '../components/header/header';
import styles from './connect.module.css';
import { Button } from '../components/button/button';

const Connect: NextPage = () => (
  <>
    <Header/>
    <div
        className={styles.connectDialog}
    >
      <h3
          className={styles.title}
      >
        CONNECT WALLET
      </h3>
      <p
          className={styles.instruction}
      >
        Select the network and wallet you want to connect
      </p>
      <p
          className={styles.subtitle}
      >
        Wallet
      </p>
      <ul
          className={styles.walletOptions}
      >
        <li
            className={styles.walletOption}
        >
          Metamask
        </li>
        <li
            className={styles.walletOption}
        >
          Wallet Connect
        </li>
        <li
            className={styles.walletOption}
        >
          Formatic
        </li>
      </ul>
      <div
          className={styles.buttonContainer}
      >
        <Button onClick={() => {}}>
          Proceed
        </Button>
      </div>
    </div>
  </>
);

export default Connect;
