import 'package:audiobooks_flutter/model/internal/database/database.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'home_page_state.freezed.dart';

@freezed
abstract class HomePageState with _$HomePageState {
    const factory HomePageState.loading() = _Loading;
    const factory HomePageState.loaded(List<Book> books) = _Loaded;
}