import 'dart:io';

import 'package:audiobooks_flutter/model/internal/models/book_with_chapters.dart';
import 'package:audiobooks_flutter/service/downloading/downloader.dart';
import 'package:flutter_downloader/flutter_downloader.dart';
import 'package:koin/koin.dart';
import 'package:bloc/bloc.dart';
import 'package:path_provider/path_provider.dart';
import 'package:rxdart/rxdart.dart';

import '../state/book_state.dart';

class BookCubit extends Cubit<BookState> with KoinComponentMixin {
  BookWithChapters bookWithChapters;
  Downloader downloader;

  BookCubit(this.bookWithChapters) : super(BookState.preparing()) {
    downloader = get();
    findCache();
  }
  
  Future<bool> findCache() async {
    
  }

  Future<void> download() async {
    emit(BookState.downloading(0));
    final remoteFiles = bookWithChapters.chapters.map((e) => e.remote).toSet();
    final ready = <File>[];
    final tmpDir = await getTemporaryDirectory();
    final tasks = await Future.wait(
      remoteFiles.map(
        (remote) => downloader.schedule(
          remote,
          tmpDir.path,
          onProgress: (count, total) => emit(
            BookState.downloading(
              ready.length + count / total / remoteFiles.length,
            ),
          ),
        ),
      ),
    );
    Rx.combineLatest<DownloadTaskData, List<DownloadTaskData>>(tasks, (values) => values).listen(
      (event) {
        emit(
          BookState.downloading(
            event.map((e) => e.progress).reduce((value, element) => value + element) / event.length,
          ),
        );
      },
      onDone: () => emit(BookState.valid()),
      onError: () => throw StateError("Downloading failed"),
    );
  }
}
