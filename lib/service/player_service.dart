import 'package:koin_flutter/koin_disposable.dart';
import 'package:sounds/sounds.dart';

class PlayerService extends Disposable {
  SoundPlayer _soundPlayer;

  PlayerService() {
    _soundPlayer = _createPlayer();
  }

  SoundPlayer _createPlayer() => SoundPlayer.withShadeUI(
        canPause: true,
        canSkipBackward: true,
        canSkipForward: true,
        playInBackground: true,
      );

  void play(List<Track> playlist, {int initialTrack = 0}) {
    stop();
  }

  void resume() => _soundPlayer.resume();

  void pause() => _soundPlayer.pause();

  void stop() {
    _soundPlayer?.release();
    _soundPlayer = _createPlayer();
  }

  @override
  void dispose() {
    _soundPlayer?.release();
  }
}
