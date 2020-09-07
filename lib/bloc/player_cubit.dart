import 'package:audiobooks_flutter/model/internal/database.dart';
import 'package:audiobooks_flutter/state/player_state.dart';
import 'package:bloc/bloc.dart';

class PlayerCubit extends Cubit<PlayerState> {
  PlayerCubit() : super(PlayerState.stopped());

  void play(Chapter book) {
    emit(PlayerState.playing(book, Duration.zero));
  }

  void resume() => state.maybeMap(
        paused: (state) => emit(PlayerState.playing(state.record, state.currentTime)),
        orElse: throw StateError('[MiniPlayerCubit]: Pause called when current state is not playing'),
      );

  void pause() => state.maybeMap(
        playing: (state) => emit(PlayerState.paused(state.record, state.currentTime)),
        orElse: throw StateError('[MiniPlayerCubit]: Pause called when current state is not playing'),
      );

  void updateProgress(Duration duration) => emit(state.map(
        stopped: throw StateError('[MiniPlayerCubit]: Tried to update progress when state is stopped'),
        playing: (value) => value.copyWith(currentTime: duration),
        paused: (value) => value.copyWith(currentTime: duration),
      ));

  void stop() => emit(PlayerState.stopped());
}
