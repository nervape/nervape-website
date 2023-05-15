import { contracts, CHAIN_ID, getAddress } from '../config/constants';
import nervapeABI from '../contracts/Nervape.json';
import multicall from './multicall';

export default async function fetchAllTokenIds(address: string) {
    const nftContracts = [
        contracts.character[CHAIN_ID],
        contracts.scene[CHAIN_ID],
        contracts.item[CHAIN_ID],
        contracts.special[CHAIN_ID]
    ];

    const balanceOfCalls = nftContracts.map(contract => {
        return {
            address: contract,
            name: 'balanceOf',
            params: [address]
        };
    });

    const balances = await multicall(nervapeABI, balanceOfCalls);
    console.log('balances', balances);
    const calls = nftContracts.reduce((memo, contract, i) => {
        // eslint-disable-next-line no-shadow, radix
        const calls = Array.from({ length: parseInt(balances[i][0]) }).map((_, i) => {
            return {
                address: contract,
                name: 'tokenOfOwnerByIndex',
                params: [address, i]
            };
        });
        return memo.concat(calls);
    }, []);

    const items = await multicall(nervapeABI, calls);
    console.log('items', items);
    return items.map((item: any) => item[0].toString());
}
