import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// TODO(shevon): ensure that these instantiation args are correct
export const metamask = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
export const formatic = new FortmaticConnector({ apiKey: 'notARealKey', chainId: 1 });
export const walletConnect = new WalletConnectConnector({});
