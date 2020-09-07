import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:dio/dio.dart';
import 'package:koin/koin.dart';
import 'package:moor/moor.dart';

import '../model/internal/dao.dart';
import '../model/internal/database.dart';
import '../service/book_parser_service.dart';
import '../state/create_book_state.dart';
import '../utils/value.dart';

Duration parseHHMMSS(String duration) {
  var values = duration.split(':'), seconds = 0, minutes = 1;

  while (values.length > 0) {
    final numString = values.last;
    values.removeLast();
    seconds += minutes * int.parse(numString ?? '');
    minutes *= 60;
  }

  return Duration(seconds: seconds);
}

class CreateBookCubit extends Cubit<CreateBookState> with KoinComponentMixin {
  BooksDao _dao;
  BookLoaderService _loaderService;

  CreateBookCubit() : super(CreateBookState.waiting()) {
    _dao = get();
    _loaderService = get();
  }

  bool get isEditable => state.maybeMap(
        waiting: (value) => true,
        hasInput: (value) => true,
        orElse: () => false,
      );

  void focused() => state.maybeMap(
        waiting: (_) => null,
        hasInput: (_) => null,
        orElse: () => emit(CreateBookState.waiting()),
      );

  void textChanged(String text) => text?.isEmpty == true
      ? emit(CreateBookState.waiting())
      : emit(CreateBookState.hasInput(
          text,
        ));

  void drop() => emit(CreateBookState.waiting());

  Future submit() async {
    return state.maybeMap(
      hasInput: (value) async {
        emit(CreateBookState.loading());
        try {
          final result = await _loaderService.loadBook(value.input);
          emit(
            CreateBookState.loaded(
              BooksCompanion(
                title: result.title.toValue(),
                author: result.author.toValue(),
                duration: result.chapters
                    .map((e) => e.duration)
                    .map(parseHHMMSS)
                    .reduce((value, element) => value + element)
                    .toValue(),
                thumbnail: Value(
                  (await Dio().get(
                    result.thumbnail,
                    options: Options(responseType: ResponseType.bytes),
                  ))
                      .data,
                ),
                // thumbnail: (await Dio().get(result.thumbnail)).data.toValue(),
              ),
            ),
          );
        } on Exception {
          emit(CreateBookState.hasInput(value.input));
          rethrow;
        }
      },
      orElse: () => throw StateError('Invalid state'),
    );
  }

  void save() {
    state.maybeMap(
      loaded: (value) async {
        emit(CreateBookState.loading());
        Timer(
          Duration(seconds: 1),
          () => emit(
            CreateBookState.created(),
          ),
        );
      },
      orElse: () => throw StateError('Invalid state'),
    );
  }
}
