import parser from 'csvtojson';
import path from 'path';

import AppError from '../errors/AppError';

import uploadConfig from '../config/upload';

import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

interface Request {
  filename: string;
}

interface TransientTransaction {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    // read data
    const importFilePath = path.join(uploadConfig.directory, filename);

    const parsedData = await parser().fromFile(importFilePath);
    // console.log(parsedData);

    const transactions = Promise.all(
      parsedData.map(async current => {
        const data = await this.saveTransaction({
          title: current.title,
          type: current.type,
          value: current.value,
          category: current.category,
        });
        return data;
      }),
    );

    // delete tmp file
    // TO DO
    return transactions;
  }

  private async saveTransaction({
    title,
    type,
    value,
    category,
  }: TransientTransaction): Promise<Transaction> {
    const createTransactionService = new CreateTransactionService();

    const transaction = await createTransactionService.execute({
      title,
      type,
      value,
      category,
      importFile: true,
    });

    if (!transaction) {
      throw new AppError('Invalid transaction on file', 500);
    }

    return transaction;
  }
}

export default ImportTransactionsService;
