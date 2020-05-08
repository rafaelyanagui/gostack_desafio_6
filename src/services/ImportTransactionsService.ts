import fs from 'fs';
import csv from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface TransactionDTO {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute(file: Express.Multer.File): Promise<Transaction[]> {
    const transactions: TransactionDTO[] = [];
    const createTransactionService = new CreateTransactionService();
    const transactionsCreated: Transaction[] = [];

    await new Promise(resolve => {
      fs.createReadStream(file.path)
        .pipe(csv({ columns: true, from_line: 1, trim: true }))
        .on('data', row => transactions.push(row))
        .on('end', resolve);
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const item of transactions) {
      // eslint-disable-next-line no-await-in-loop
      const transactionCreated = await createTransactionService.execute(item);
      transactionsCreated.push(transactionCreated);
    }

    return transactionsCreated;
  }
}

export default ImportTransactionsService;
