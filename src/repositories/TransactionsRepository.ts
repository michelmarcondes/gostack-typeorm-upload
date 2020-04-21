import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  private balance: Balance;

  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const income = this.reducer(transactions, 'income');
    const outcome = this.reducer(transactions, 'outcome');
    const total = income - outcome;

    this.balance = {
      income,
      outcome,
      total,
    };

    return this.balance;
  }

  private reducer(transactions: Transaction[], type: string): number {
    const initialValue = 0;
    return transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === type) {
        return accumulator + currentValue.value;
      }
      return accumulator;
    }, initialValue);
  }
}

export default TransactionsRepository;
