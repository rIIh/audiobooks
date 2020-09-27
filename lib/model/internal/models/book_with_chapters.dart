import 'package:audiobooks_flutter/utils/reduce_helpers.dart';

import '../database/database.dart';

class BookWithChapters {
  final Book book;
  final List<Chapter> chapters;

  BookWithChapters(this.book, this.chapters);

  Duration get duration =>
      chapters.length > 0 ? chapters.map((e) => e.duration).reduce((value, element) => value + element) : Duration.zero;
}
