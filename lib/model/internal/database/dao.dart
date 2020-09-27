import 'package:audiobooks_flutter/bloc/create_book_cubit.dart';
import 'package:audiobooks_flutter/model/internal/models/book_with_chapters.dart';
import 'package:dio/dio.dart';
import 'package:moor/moor.dart';
import 'package:rxdart/rxdart.dart';

import '../../../utils/value.dart';
import '../../remote/parsed_book.dart';
import 'database.dart';
import 'tables.dart';

part 'dao.g.dart';

@UseDao(tables: [Books, Chapters, DownloadCacheEntries])
class BooksDao extends DatabaseAccessor<Database> with _$BooksDaoMixin {
  BooksDao(Database db) : super(db);

  Stream<List<BookWithChapters>> watchAll() {
    final bookStream = select(books).watch();
    final chaptersStream = select(chapters).watch();

    return Rx.combineLatest2<List<Book>, List<Chapter>, List<BookWithChapters>>(
      bookStream,
      chaptersStream,
      (books, chapters) => books
          .map(
            (book) => BookWithChapters(
              book,
              chapters.where((chapter) => chapter.bookId == book.id).toList(),
            ),
          )
          .toList(),
    );
  }

  Future<List<DownloadCacheEntry>> findTasksForBook(BooksCompanion book) async =>
      (select(downloadCacheEntries)..where((tbl) => tbl.bookId.equals(book.id.value))).get();

  Future saveBook(ParsedBook bookCandidate) async {
    final bookId = await into(books).insert(
      BooksCompanion(
        title: bookCandidate.title.toValue(),
        author: bookCandidate.author.toValue(),
        thumbnail: Value(
          (await Dio().get(
            bookCandidate.thumbnail,
            options: Options(responseType: ResponseType.bytes),
          ))
              .data,
        ),
      ),
    );

    await batch((batch) {
      batch.insertAll(
          chapters,
          bookCandidate.chapters
              .map(
                (e) => ChaptersCompanion(
                  title: e.title.toValue(),
                  bookId: bookId.toValue(),
                  duration: parseHHMMSS(e.duration).toValue(),
                  remote: e.downloadUrl.toValue(),
                ),
              )
              .toList());
    });
  }

  Future deleteBook(int id) async {
    await (delete(books)
          ..whereSamePrimaryKey(BooksCompanion(
            id: id.toValue(),
          )))
        .go();

    await (delete(chapters)..where((tbl) => tbl.bookId.equals(id))).go();
  }
}
