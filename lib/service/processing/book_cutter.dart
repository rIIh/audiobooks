import 'package:audiobooks_flutter/model/internal/database/database.dart';

abstract class BookCutter {
  Future<List<String>> cut(Book book) {

  }
}