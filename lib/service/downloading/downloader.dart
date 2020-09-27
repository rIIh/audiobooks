import 'dart:io';
import 'dart:isolate';
import 'dart:ui';

import 'package:dio/dio.dart';
import 'package:flutter_downloader/flutter_downloader.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:koin/koin.dart';
import 'package:moor/moor.dart';
import 'package:rxdart/rxdart.dart';

import '../../utils/reactive.dart';

part 'downloader.freezed.dart';

@freezed
abstract class DownloadTaskData with _$DownloadTaskData {
  const factory DownloadTaskData(
    String id,
    DownloadTaskStatus status,
    int progress,
    String url,
    String filename,
    String savedDir,
    int timeCreated,
  ) = _DownloadTaskData;

  factory DownloadTaskData.from(DownloadTask task) => DownloadTaskData(
      task.taskId, task.status, task.progress, task.url, task.filename, task.savedDir, task.timeCreated);
}

class Downloader with KoinComponentMixin {
  static const channel = 'downloader_channel';
  final _channelPort = ReceivePort();

  final Reactive<Map<String, DownloadTaskData>> _tasks = Reactive();

  ReadOnlyReactive<Map<String, DownloadTaskData>> get tasks => _tasks;

  Downloader() {
    FlutterDownloader.loadTasks().then(
      (loadedTasks) => _tasks.set(
        Map.fromEntries(
          loadedTasks.map(
            (task) => MapEntry(
              task.taskId,
              DownloadTaskData.from(task),
            ),
          ),
        ),
      ),
    );
    IsolateNameServer.registerPortWithName(_channelPort.sendPort, channel);
    FlutterDownloader.registerCallback(downloadCallback);
    _channelPort.listen(
      (dynamic data) {
        String id = data[0];
        DownloadTaskStatus status = data[1];
        int progress = data[2];

        final currentTasks = Map.of(tasks.value);
        if (currentTasks.containsKey(id)) {
          currentTasks.update(id, (value) => value.copyWith(status: status, progress: progress));
          _tasks.set(currentTasks);
        }
      },
    );
  }

  void dispose() {
    IsolateNameServer.removePortNameMapping(channel);
    _channelPort.close();
  }

  Future<Stream<DownloadTaskData>> schedule(
    String url,
    String path, {
    ProgressCallback onProgress,
  }) async {
    final id = await FlutterDownloader.enqueue(
      url: url,
      savedDir: path,
    );
    final task = (await FlutterDownloader.loadTasks()).firstWhere((element) => element.taskId == id);
    _tasks.set(Map.of(_tasks.value)..putIfAbsent(id, () => DownloadTaskData.from(task)));
    return monitor(id);
  }

  Stream<DownloadTaskData> monitor(String id) =>
      tasks.watch().map((event) => event.containsKey(id) ? event[id] : null).where((event) => event != null);

  static void downloadCallback(String id, DownloadTaskStatus status, int progress) {
    final send = IsolateNameServer.lookupPortByName(channel);

    send.send([id, status, progress]);
  }
}
