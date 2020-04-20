import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import GetCategoryService from './GetCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    // get category
    const categoryService = new GetCategoryService();
    const persistedCategory = await categoryService.execute({
      categoryTitle: category,
    });

    if (!persistedCategory) {
      throw new AppError('Impossible create or get a category.');
    }

    // create transaction
    const transactionRepository = getRepository(Transaction);
    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: persistedCategory,
    });

    await transactionRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
