import useSWR from 'swr';
import { providers } from 'ethers'
import useKeepSWRDataLiveAsBlocksArrive from './useKeepSWRDataLiveAsBlocksArrive';
import multicall from '../utils/multicall';
import { contracts, CHAIN_ID, getAddress, RPC } from '../config/constants';
import nervapeABI from '../contracts/Nervape.json';

function fetchAllTokenIds(address: string) {
    return async () => {
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
    };
}

function fetchCollectionTokenIds(contract: string, address: string, chainId?: number) {
    return async () => {
        const balanceOfCall = [
            {
                address: contract,
                name: 'balanceOf',
                params: [address]
            }
        ];

        const [balance] = await multicall(nervapeABI, balanceOfCall, chainId);

        // eslint-disable-next-line radix
        const calls = Array.from({ length: parseInt(balance[0]) }).map((_, i) => {
            return {
                address: contract,
                name: 'tokenOfOwnerByIndex',
                params: [address, i]
            };
        });

        const items = await multicall(nervapeABI, calls, chainId);

        return items.map((item: any) => item[0].toString());
    };
}

export function useFetchCollectionTokenIds(collecionName: string, address: string) {
    const contract = getAddress(contracts[collecionName]);
    const result = useSWR(['Items', address], fetchCollectionTokenIds(contract, address), {
        suspense: false
    });

    useKeepSWRDataLiveAsBlocksArrive(result.mutate);

    return result;
}

export function useFetchPhysicalNFTIds(address: string, chainId: number) {
    const contract = contracts.physicalNft[chainId]
    return fetchCollectionTokenIds(contract, address, chainId);
}

export default function useFetchAllTokenIds(address: string) {
    return fetchAllTokenIds(address);
}

