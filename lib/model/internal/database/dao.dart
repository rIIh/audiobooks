import 'package:moor/moor.dart';

import 'database.dart';
import 'tables.dart';

part 'dao.g.dart';

@UseDao(tables: [Books, Chapters])
class BooksDao extends DatabaseAccessor<Database> with _$BooksDaoMixin {
  BooksDao(Database db) : super(db);

  Stream<List<Book>> watchAll() => select(books).watch();
}