import 'package:audiobooks_flutter/model/internal/database/database.dart';
import 'package:audiobooks_flutter/service/player_service.dart';
import 'package:flutter/cupertino.dart';
import 'package:koin_flutter/koin_disposable.dart';
import 'package:koin/koin.dart';

class BookPlayerService with KoinComponentMixin implements Disposable {
  PlayerService _playerService;

  BookPlayerService([PlayerService playerService]) {
    _playerService = playerService ?? get();
  }

  void play({
    @required Book book,
  }) {
    print(book.id);
    // _playerService.play(book.chapters.map((chapter) => chapter.file));
  }

  @override
  void dispose() {

  }
}
