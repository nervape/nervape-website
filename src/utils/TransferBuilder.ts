import PWCore, {
    Builder,
    Address,
    Amount,
    Cell,
    RawTransaction,
    Transaction,
    BuilderOption,
    CellDep,
    AmountUnit
} from '@lay2/pw-core';
import BasicCollector from './BasicCollector';

export class TransferBuilder extends Builder {
    constructor(
        private fromAddress: Address,
        private toAddress: Address,
        private amount: Amount,
        protected options: BuilderOption = {},
        private cellDeps: CellDep[],
        protected collector: BasicCollector
    ) {
        super(options.feeRate, collector, options.witnessArgs);
    }

    async build(fee = new Amount('100000', AmountUnit.shannon)): Promise<Transaction> {
        const inputCells: Cell[] = [];
        const outputCells: Cell[] = [];

        const toAddressLock = this.toAddress.toLockScript();

        const outputCell = new Cell(this.amount, toAddressLock);
        outputCells.push(outputCell);

        // Calculate the required capacity.
        // const outputCellsCapacitySum = outputCells.reduce((a, b) => a.add(b.capacity), Amount.ZERO);
        // const neededAmount = outputCellsCapacitySum.add(new Amount('61', AmountUnit.ckb)).add(fee);

        // Add necessary capacity.
        const capacityCells = await this.collector.collectCapacity(
            this.fromAddress,
            this.amount.add(fee)
        );
        for (const cell of capacityCells) {
            inputCells.push(cell);
        }

        // Calculate the input capacity and change cell amounts.
        const inputCapacity = capacityCells.reduce((a, c) => a.add(c.capacity), Amount.ZERO);
        const changeCapacity = inputCapacity.sub(this.amount.add(fee));

        if (changeCapacity.gt(Amount.ZERO)) {
            // Add the change cell.
            const changeLockScript = this.fromAddress.toLockScript();
            const changeCell = new Cell(changeCapacity, changeLockScript);
            outputCells.push(changeCell);
        }

        // Add the required cell deps.
        const cellDeps = [...this.cellDeps];

        if (PWCore.config) {
            cellDeps.push(
                PWCore.config.defaultLock.cellDep,
                PWCore.config.pwLock.cellDep,
                PWCore.config.sudtType.cellDep
            );
        }

        const rawTx = new RawTransaction(inputCells, outputCells, cellDeps);

        const tx = new Transaction(rawTx, [this.witnessArgs]);
        this.fee = Builder.calcFee(tx, this.feeRate);

        return tx;
    }

    getCollector() {
        return this.collector;
    }
}
