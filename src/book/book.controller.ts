import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './book.model';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  async getAllBooks(): Promise<Book[]> {
    return this.bookService.getAllBooks();
  }
  @Post()
  async postBook(@Body() postData: Book): Promise<Book> {
    return this.bookService.createBook(postData);
  }

  @Get(':id')
  async getBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.getBook(Number(id));
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: number): Promise<Book> {
    return this.bookService.deleteBook(id);
  }

  @Put(':id')
  async updateBook(
    @Param('id') id: number,
    @Body() postData: Book,
  ): Promise<Book> {
    return this.bookService.updateBook(id, postData);
  }
}
