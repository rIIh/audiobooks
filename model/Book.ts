import { Model, Query } from '@nozbe/watermelondb';
import { children, field } from '@nozbe/watermelondb/decorators';
import Chapter from './Chapter';

export default class Book extends Model {
  static table = 'books';
  static associations = {
    chapters: { type: 'has_many' as 'has_many', foreignKey: 'book_id' },
  };

  @field('title') title!: string;
  @field('author') author!: string;
  @field('thumbnail') thumbnail!: string;
  @children('chapters') chapters!: Query<Chapter>;
}
