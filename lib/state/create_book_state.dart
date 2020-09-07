import 'package:freezed_annotation/freezed_annotation.dart';

import '../model/internal/database.dart';

part 'create_book_state.freezed.dart';

@freezed
abstract class CreateBookState with _$CreateBookState {
  const factory CreateBookState.waiting() = _Waiting;

  const factory CreateBookState.hasInput(String input) = _HasInput;

  const factory CreateBookState.loading() = _Loading;

  const factory CreateBookState.loaded(BooksCompanion bookCandidate) = _Loaded;

  const factory CreateBookState.created() = _Created;
}
