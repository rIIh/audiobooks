import 'package:moor/moor.dart';

class Books extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text()();

  TextColumn get author => text().nullable()();

  BlobColumn get thumbnail => blob().nullable()();

  TextColumn get origin => text().nullable()();
}

class Chapters extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text()();

  IntColumn get duration => integer().map(DurationConverter())();

  TextColumn get remote => text().nullable()();

  IntColumn get bookId => integer().customConstraint('REFERENCES books(id)')();
}

class Caches extends Table {
  IntColumn get id => integer().autoIncrement()();

  IntColumn get chapterId => integer().customConstraint('REFERENCES chapters(id)')();

  TextColumn get path => text()();

  TextColumn get md5 => text()();
}

@DataClassName('DownloadCacheEntry')
class DownloadCacheEntries extends Table {
  IntColumn get id => integer().autoIncrement()();

  IntColumn get bookId => integer().customConstraint('REFERENCES books(id)')();
  TextColumn get taskId => text().customConstraint('UNIQUE')();
}

class DurationConverter extends TypeConverter<Duration, int> {
  const DurationConverter();

  @override
  Duration mapToDart(int fromDb) {
    if (fromDb == null) {
      return null;
    }
    return Duration(seconds: fromDb);
  }

  @override
  int mapToSql(Duration value) {
    if (value == null) {
      return null;
    }
    return value.inSeconds;
  }
}

