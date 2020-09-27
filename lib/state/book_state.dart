import 'package:freezed_annotation/freezed_annotation.dart';

part 'book_state.freezed.dart';

@freezed
abstract class BookState with _$BookState {
  const factory BookState.preparing() = _Preparing;
  const factory BookState.downloading(double progress) = _Downloading;
  const factory BookState.missingCache() = _MissingCache;
  const factory BookState.valid() = _Valid;
}