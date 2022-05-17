import type { NextPage } from 'next';
import React from 'react';
import { Header } from '../components/header/header';
import { Logo } from '../components/logo';
import hero from './assets/hero.png';
import styles from './index.module.css';
import { Button } from '../components/button/button';

const Home: NextPage = () => (
  <>
    <Header/>
    <div
        className={styles.content}
    >
      <div
          className={styles.left}
      >
        <div
            className={styles.copy}
        >
          <Logo/>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tempor aenean amet, turpis interdum ut cras. Eget et morbi egestas diam urna, faucibus ut ac scelerisque</p>
          <Button
              onClick={() => {}}
          >
            Connect my wallet
          </Button>
        </div>
      </div>
      <div
          className={styles.right}
      >
        <img
            src={hero.src}
            className={styles.hero}
        />
      </div>
    </div>
  </>
);

export default Home;
