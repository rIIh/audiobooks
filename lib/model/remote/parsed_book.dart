import 'package:audiobooks_flutter/bloc/create_book_cubit.dart';
import 'package:audiobooks_flutter/utils/reduce_helpers.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'parsed_book.freezed.dart';

part 'parsed_book.g.dart';

@freezed
abstract class ParsedBook with _$ParsedBook {
  factory ParsedBook(
    String title,
    String author,
    String thumbnail,
    List<ParsedChapter> chapters,
  ) = _ParsedBook;

  factory ParsedBook.fromJson(Map<String, dynamic> json) => _$ParsedBookFromJson(json);

  @late
  Duration get duration => chapters.map((e) => e.duration).map(parseHHMMSS).reduce(
        (value, element) => value + element,
      );
}

@freezed
abstract class ParsedChapter with _$ParsedChapter {
  const factory ParsedChapter(String title, String downloadUrl, String duration) = _ParsedChapter;

  factory ParsedChapter.fromJson(Map<String, dynamic> json) => _$ParsedChapterFromJson(json);
}
