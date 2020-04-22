import {Model, Relation} from '@nozbe/watermelondb';
import {field, relation} from '@nozbe/watermelondb/decorators';
import Book from "./Book";

export default class FilePath extends Model {
  static table = 'files';
  static associations = {
    book: { type: 'belongs_to' as 'belongs_to', key: 'book_id' },
  };

  @relation(Book.table, 'book_id') book!: Relation<Book>;
  @field('url') url!: string;
  @field('path') path!: string;
  @field('remote_size') remoteSize?: number | null;
}
