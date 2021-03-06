import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Tournament } from '../typechain';

describe('Tournament', () => {
    const TOURNAMENT_NAME = 'test';
    const TOURNAMENT_PASSWORD = 'test';
    const MIN_TEAM_SIZE = 1;
    const MAX_TEAM_SIZE = 2;
    const TEAM_LIMIT = 2;

    let tournament: Tournament;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addrs: SignerWithAddress[];

    beforeEach(async () => {
        const Tournament = await ethers.getContractFactory('Tournament');
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        tournament = await Tournament.deploy(TOURNAMENT_NAME, TOURNAMENT_PASSWORD, MIN_TEAM_SIZE, MAX_TEAM_SIZE, TEAM_LIMIT);
        await tournament.deployed();
    })

    describe('Initialization', () => {
        it('Inital teamCount is 0', async () => {
            expect(await tournament.getTeamCount()).to.eq(0);
        });
    });

    describe('Register', () => {
        it('Should increment teamCount', async () => {
            let registerTx = await tournament.register('team1', [{ wallet: addr1.address, externalPlayerId: 'addr1' }]);
            await registerTx.wait()

            expect(await tournament.getTeamCount()).to.eq(1);
        });

        it('Should add players to team', async () => {
            let registerTx = await tournament.register(
                'team1',
                [
                    { wallet: addr1.address, externalPlayerId: 'addr1' },
                    { wallet: addr2.address, externalPlayerId: 'addr2' },
                ]);
            await registerTx.wait()

            let player = await tournament.getTeam('team1');
            expect(player).to.deep.eq([
                [addr1.address, 'addr1'],
                [addr2.address, 'addr2'],
            ]);
        });

        it('Should revert if too little players', async () => {
            // let registerTx = await tournament.register('team1', []);
            await expect(
                tournament.register('team1', [])
            ).to.be.revertedWith('Team has too little players');
        });

        it('Should revert if too many players', async () => {
            await expect(
                tournament.register(
                    'team1',
                    [
                        { wallet: owner.address, externalPlayerId: 'owner' },
                        { wallet: addr1.address, externalPlayerId: 'addr1' },
                        { wallet: addr2.address, externalPlayerId: 'addr2' },
                    ]
                )
            ).to.be.revertedWith('Team has too many players');
        });

        it('Should revert if tournament is full', async () => {
            let register1Tx = await tournament.register('team1', [{ wallet: owner.address, externalPlayerId: 'owner' }]);
            let register2Tx = await tournament.register('team2', [{ wallet: addr1.address, externalPlayerId: 'addr1' }]);
            await Promise.all([
                register1Tx.wait(),
                register2Tx.wait(),
            ]);

            await expect(
                tournament.register('team3', [{ wallet: addr2.address, externalPlayerId: 'addr2' }])
            ).to.be.revertedWith('Tourament is full');
        });

        it('Should revert if team exists', async () => {
            let register1Tx = await tournament.register('team1', [{ wallet: owner.address, externalPlayerId: 'owner' }]);
            await register1Tx.wait();

            await expect(
                tournament.register('team1', [{ wallet: addr1.address, externalPlayerId: 'addr1' }])
            ).to.be.reverted;
        })
    });

    describe("Unregister", () => {
        describe("With 2 teams", () => {
            let TEAM_1 = "team1";
            let TEAM_2 = "team2";
            beforeEach(async () => {
                let register1Tx = await tournament.register(TEAM_1, [{ wallet: owner.address, externalPlayerId: 'owner' }]);
                let register2Tx = await tournament.register(TEAM_2, [{ wallet: addr1.address, externalPlayerId: 'addr1' }]);
                await Promise.all([
                    register1Tx.wait(),
                    register2Tx.wait(),
                ]);
            });

            it('Should decrement teamCount', async () => {
                let unregisterTx = tournament.unregister(TEAM_1);
                await (await unregisterTx).wait();

                expect(await tournament.getTeamCount()).to.eq(1);
            });

            it('Should remove empty team from mapping', async () => {
                let unregisterTx = tournament.unregister(TEAM_1);
                await (await unregisterTx).wait();

                expect(await tournament.getTeam(TEAM_1)).to.be.empty;
                expect(await tournament.getTeamNames()).to.not.contain(TEAM_1);
            });

            it('Should revert if non team member called method', async () => {

            });
        });

        it('Should revert if no teams are registered', async () => {
            await expect(tournament.unregister("test")).to.be.reverted;
        });
    });

    describe('Close Registrations', () => {
        it('Should revert if host did not call method', async () => {
            await expect(tournament.connect(addr1).closeRegisteration()).to.be.revertedWith('Only host can close tournament');
        });

        it('Should revert if requiredTeamCount is not met', async () => {
            await expect(tournament.closeRegisteration()).to.be.revertedWith('Not enough teams');
        });

        it('Should set "open" to false', async () => {
            let register1Tx = await tournament.register('team1', [{ wallet: owner.address, externalPlayerId: 'owner' }]);
            let register2Tx = await tournament.register('team2', [{ wallet: addr1.address, externalPlayerId: 'addr1' }]);
            let closeTx = await tournament.closeRegisteration();
            Promise.all([
                register1Tx,
                register2Tx,
                closeTx,
            ]);

            expect(await tournament.getOpen()).to.be.false;
        });
    });

    describe('Create Game Contracts', () => {
        // Maybe only the contract itself should be able to create the game
    });

    describe('Resolve Game', () => {
        // Maybe only this should be private too
    });

    describe('Complete Tournament', () => {
        // Maybe only this should be private too
    });
});