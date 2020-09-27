import 'package:audiobooks_flutter/model/internal/database/database.dart';
import 'package:freezed_annotation/freezed_annotation.dart';

part 'player_state.freezed.dart';

@freezed
abstract class PlayerState with _$PlayerState {
  const factory PlayerState.stopped() = Stopped;

  @With(PlayingProgress)
  const factory PlayerState.playing(
    Chapter record,
    Duration currentTime,
  ) = Playing;

  @With(PlayingProgress)
  const factory PlayerState.paused(
    Chapter record,
    Duration currentTime,
  ) = Paused;
}

mixin PlayingProgress {
  Chapter get record;

  Duration get currentTime;

  double get progress => currentTime.inSeconds / record.duration.inSeconds;
}
