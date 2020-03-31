import { Model, Relation } from '@nozbe/watermelondb';
import field from '@nozbe/watermelondb/decorators/field';
import { relation } from '@nozbe/watermelondb/decorators';
import Book from './Book';
export default class Chapter extends Model {
  static table = 'chapters';
  static associations = {
    book: { type: 'belongs_to' as 'belongs_to', key: 'book_id' },
  };

  @relation(Book.table, 'book_id') book!: Relation<Book>;
  @field('index') index!: number;
  @field('title') title!: string;
  @field('duration') duration!: number;
  @field('download_url') downloadURL!: string;
}
