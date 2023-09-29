import { Prisma } from '@prisma/client';

export class Book implements Prisma.BookCreateInput {
  id?: number;
  title: string;
  author: string;
}
