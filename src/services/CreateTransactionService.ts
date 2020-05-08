import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: string;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    type,
    value,
    category,
  }: Request): Promise<Transaction> {
    const valueConvertedNumber = Number(value);

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (Number.isNaN(valueConvertedNumber)) {
      throw new AppError(
        'Value field is invalid number, please inform a valid number (Example: 100.50).',
      );
    }

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(
        'Type field is invalid, please inform the type "income" or "outcome".',
      );
    }

    if (type === 'outcome' && valueConvertedNumber > total) {
      throw new AppError('Balance insuficient. You don`t have enough balance.');
    }

    if (!category) {
      throw new AppError(
        'Category field is required, please inform the transasction`s category.',
      );
    }

    const findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    let transaction_category_id;

    if (!findCategory) {
      const newCategory = await categoryRepository.create({
        title: category,
      });
      const createdCategory = categoryRepository.create(newCategory);

      const savedCategory = await categoryRepository.save(createdCategory);

      transaction_category_id = savedCategory.id;
    } else {
      transaction_category_id = findCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value: valueConvertedNumber,
      type,
      category_id: transaction_category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
