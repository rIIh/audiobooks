import 'package:moor/moor.dart';

class Books extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text()();

  TextColumn get author => text().nullable()();

  BlobColumn get thumbnail => blob().nullable()();

  IntColumn get duration => integer().map(DurationConverter())();
}

class Chapters extends Table {
  IntColumn get id => integer().autoIncrement()();

  TextColumn get title => text()();

  IntColumn get duration => integer().map(DurationConverter())();

  TextColumn get record => text().nullable()();

  IntColumn get bookId => integer().customConstraint('REFERENCES books(id)')();
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
