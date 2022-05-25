import { useWeb3React } from '@web3-react/core';
import type { NextPage } from 'next';
import React from 'react';
import { Button } from '../components/button/button';
import { Header } from '../components/header/header';
import { FormaticIcon } from './assets/wallet_icons/formatic';
import { MetamaskIcon } from './assets/wallet_icons/metamask';
import { WalletConnectIcon } from './assets/wallet_icons/wallet_connect';
import styles from './connect.module.css';
import { metamask, walletConnect, formatic } from './connectors';

const Connect: NextPage = () => {
  const { activate } = useWeb3React();

  async function connect(wallet: 'metamask' | 'walletConnect' | 'formatic') {
    // TODO(shevon): Add loading state so that user knows that connection is being attempted
    const connector = wallet === 'metamask' ? metamask : (wallet === 'walletConnect' ? walletConnect : formatic);
    try {
      await activate(connector);
    } catch (e) {
      console.error(e);
    }
  }

  return (
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
              role='button'
              onClick={() => connect('metamask')}
          >
            <MetamaskIcon/> Metamask
          </li>
          <li
              className={styles.walletOption}
              role='button'
              onClick={() => connect('walletConnect')}
          >
            <WalletConnectIcon/> Wallet Connect
          </li>
          <li
              className={styles.walletOption}
              role='button'
              onClick={() => connect('formatic')}
          >
            <FormaticIcon/> Formatic
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
};

export default Connect;
