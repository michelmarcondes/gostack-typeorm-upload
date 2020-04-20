import { getRepository } from 'typeorm';
import Category from '../models/Category';

interface Request {
  categoryTitle: string;
}

class GetCategoryService {
  public async execute({ categoryTitle }: Request): Promise<Category> {
    // if a category doesn't exist, create
    const categoryRepository = getRepository(Category);

    const category = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    if (category) {
      return category;
    }

    const newCategory = categoryRepository.create({
      title: categoryTitle,
    });

    await categoryRepository.save(newCategory);

    return newCategory;
  }
}

export default GetCategoryService;
