import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const balance: Balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    const transactions = await this.find();

    const transactionGroupByType = transactions.reduce((acc, obj) => {
      const { type } = obj;

      acc[type] += obj.value;

      if (type === 'income') {
        acc.total += obj.value;
      } else if (type === 'outcome') {
        acc.total -= obj.value;
      }

      return acc;
    }, balance);

    return transactionGroupByType;
  }
}

export default TransactionsRepository;
