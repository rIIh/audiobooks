import 'package:audiobooks_flutter/model/internal/database/database.dart';
import 'package:audiobooks_flutter/model/remote/parsed_book.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'create_book_state.freezed.dart';

@freezed
abstract class CreateBookState with _$CreateBookState {
  const factory CreateBookState.waiting() = _Waiting;

  const factory CreateBookState.hasInput(String input) = _HasInput;

  const factory CreateBookState.loading() = _Loading;

  const factory CreateBookState.loaded(
    ParsedBook bookCandidate,
  ) = _Loaded;

  const factory CreateBookState.created() = _Created;
}
