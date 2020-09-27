import 'package:audiobooks_flutter/model/internal/database/database.dart';

abstract class AudioCutter {
  /// Cuts audio files by durations and returns files names in format 0_0.mp3 where first number is track index, and second is duration index
  Future<List<String>> cut(Map<String, List<int>> targetDurations) async {
    
  }
}
