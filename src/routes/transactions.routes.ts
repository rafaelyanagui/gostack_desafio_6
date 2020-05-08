import { Router } from 'express';

import multer from 'multer';

import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });
  const balance = await transactionsRepository.getBalance();

  const transactionsTransformed = transactions.map(
    ({ id, title, value, category, created_at, updated_at }) => {
      return {
        id,
        title,
        value,
        category,
        created_at,
        updated_at,
      };
    },
    [],
  );

  return response.json({
    transactions: transactionsTransformed,
    balance,
  });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();

  const { id } = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json({
    id,
    title,
    value,
    type,
    category,
  });
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(request.file);

    return response.json({ transactions });
  },
);

export default transactionsRouter;
