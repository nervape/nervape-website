// eslint-disable-next-line prettier/prettier
import React from 'react';
import { useAccount, useBalance } from 'wagmi';

const ETHBalance = () => {
    const { address } = useAccount();
    const { data, isError, isLoading } = useBalance({ address });

    if (isLoading || isError || !data) return <div className="balance">0 CKB</div>;
    const myBalance = () => {
        const balanceArr = data?.formatted.split('.');
        return (
            <>
                {balanceArr[0]}
                <span>{balanceArr[1] ? `.${balanceArr[1]}` : ''}</span>
                &thinsp;CKB
            </>
        );
    };
    return <div className="balance">{myBalance()}</div>;
};

export default ETHBalance;
