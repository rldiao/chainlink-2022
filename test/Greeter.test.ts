import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Greeter } from '../typechain';

describe('Greeter', function (): void {
  let greeter: Greeter;

  this.beforeEach(async () => {
    const Greeter = await ethers.getContractFactory('Greeter');
    greeter = await Greeter.deploy('Hello, world!');
    await greeter.deployed();
  })


  it("Should return the new greeting once it's changed", async function (): Promise<void> {
    expect(await greeter.greet()).to.equal('Hello, world!');

    const setGreetingTx = await greeter.setGreeting('Hola, mundo!');

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal('Hola, mundo!');
  });
});
