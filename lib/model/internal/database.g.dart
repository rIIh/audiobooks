// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'database.dart';

// **************************************************************************
// MoorGenerator
// **************************************************************************

// ignore_for_file: unnecessary_brace_in_string_interps, unnecessary_this
class Book extends DataClass implements Insertable<Book> {
  final int id;
  final String title;
  final String author;
  final Uint8List thumbnail;
  final Duration duration;
  Book(
      {@required this.id,
      @required this.title,
      this.author,
      this.thumbnail,
      @required this.duration});
  factory Book.fromData(Map<String, dynamic> data, GeneratedDatabase db,
      {String prefix}) {
    final effectivePrefix = prefix ?? '';
    final intType = db.typeSystem.forDartType<int>();
    final stringType = db.typeSystem.forDartType<String>();
    final uint8ListType = db.typeSystem.forDartType<Uint8List>();
    return Book(
      id: intType.mapFromDatabaseResponse(data['${effectivePrefix}id']),
      title:
          stringType.mapFromDatabaseResponse(data['${effectivePrefix}title']),
      author:
          stringType.mapFromDatabaseResponse(data['${effectivePrefix}author']),
      thumbnail: uint8ListType
          .mapFromDatabaseResponse(data['${effectivePrefix}thumbnail']),
      duration: $BooksTable.$converter0.mapToDart(
          intType.mapFromDatabaseResponse(data['${effectivePrefix}duration'])),
    );
  }
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (!nullToAbsent || id != null) {
      map['id'] = Variable<int>(id);
    }
    if (!nullToAbsent || title != null) {
      map['title'] = Variable<String>(title);
    }
    if (!nullToAbsent || author != null) {
      map['author'] = Variable<String>(author);
    }
    if (!nullToAbsent || thumbnail != null) {
      map['thumbnail'] = Variable<Uint8List>(thumbnail);
    }
    if (!nullToAbsent || duration != null) {
      final converter = $BooksTable.$converter0;
      map['duration'] = Variable<int>(converter.mapToSql(duration));
    }
    return map;
  }

  BooksCompanion toCompanion(bool nullToAbsent) {
    return BooksCompanion(
      id: id == null && nullToAbsent ? const Value.absent() : Value(id),
      title:
          title == null && nullToAbsent ? const Value.absent() : Value(title),
      author:
          author == null && nullToAbsent ? const Value.absent() : Value(author),
      thumbnail: thumbnail == null && nullToAbsent
          ? const Value.absent()
          : Value(thumbnail),
      duration: duration == null && nullToAbsent
          ? const Value.absent()
          : Value(duration),
    );
  }

  factory Book.fromJson(Map<String, dynamic> json,
      {ValueSerializer serializer}) {
    serializer ??= moorRuntimeOptions.defaultSerializer;
    return Book(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      author: serializer.fromJson<String>(json['author']),
      thumbnail: serializer.fromJson<Uint8List>(json['thumbnail']),
      duration: serializer.fromJson<Duration>(json['duration']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer serializer}) {
    serializer ??= moorRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'author': serializer.toJson<String>(author),
      'thumbnail': serializer.toJson<Uint8List>(thumbnail),
      'duration': serializer.toJson<Duration>(duration),
    };
  }

  Book copyWith(
          {int id,
          String title,
          String author,
          Uint8List thumbnail,
          Duration duration}) =>
      Book(
        id: id ?? this.id,
        title: title ?? this.title,
        author: author ?? this.author,
        thumbnail: thumbnail ?? this.thumbnail,
        duration: duration ?? this.duration,
      );
  @override
  String toString() {
    return (StringBuffer('Book(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('author: $author, ')
          ..write('thumbnail: $thumbnail, ')
          ..write('duration: $duration')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => $mrjf($mrjc(
      id.hashCode,
      $mrjc(
          title.hashCode,
          $mrjc(
              author.hashCode, $mrjc(thumbnail.hashCode, duration.hashCode)))));
  @override
  bool operator ==(dynamic other) =>
      identical(this, other) ||
      (other is Book &&
          other.id == this.id &&
          other.title == this.title &&
          other.author == this.author &&
          other.thumbnail == this.thumbnail &&
          other.duration == this.duration);
}

class BooksCompanion extends UpdateCompanion<Book> {
  final Value<int> id;
  final Value<String> title;
  final Value<String> author;
  final Value<Uint8List> thumbnail;
  final Value<Duration> duration;
  const BooksCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.author = const Value.absent(),
    this.thumbnail = const Value.absent(),
    this.duration = const Value.absent(),
  });
  BooksCompanion.insert({
    this.id = const Value.absent(),
    @required String title,
    this.author = const Value.absent(),
    this.thumbnail = const Value.absent(),
    @required Duration duration,
  })  : title = Value(title),
        duration = Value(duration);
  static Insertable<Book> custom({
    Expression<int> id,
    Expression<String> title,
    Expression<String> author,
    Expression<Uint8List> thumbnail,
    Expression<int> duration,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (author != null) 'author': author,
      if (thumbnail != null) 'thumbnail': thumbnail,
      if (duration != null) 'duration': duration,
    });
  }

  BooksCompanion copyWith(
      {Value<int> id,
      Value<String> title,
      Value<String> author,
      Value<Uint8List> thumbnail,
      Value<Duration> duration}) {
    return BooksCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      author: author ?? this.author,
      thumbnail: thumbnail ?? this.thumbnail,
      duration: duration ?? this.duration,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (author.present) {
      map['author'] = Variable<String>(author.value);
    }
    if (thumbnail.present) {
      map['thumbnail'] = Variable<Uint8List>(thumbnail.value);
    }
    if (duration.present) {
      final converter = $BooksTable.$converter0;
      map['duration'] = Variable<int>(converter.mapToSql(duration.value));
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('BooksCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('author: $author, ')
          ..write('thumbnail: $thumbnail, ')
          ..write('duration: $duration')
          ..write(')'))
        .toString();
  }
}

class $BooksTable extends Books with TableInfo<$BooksTable, Book> {
  final GeneratedDatabase _db;
  final String _alias;
  $BooksTable(this._db, [this._alias]);
  final VerificationMeta _idMeta = const VerificationMeta('id');
  GeneratedIntColumn _id;
  @override
  GeneratedIntColumn get id => _id ??= _constructId();
  GeneratedIntColumn _constructId() {
    return GeneratedIntColumn('id', $tableName, false,
        hasAutoIncrement: true, declaredAsPrimaryKey: true);
  }

  final VerificationMeta _titleMeta = const VerificationMeta('title');
  GeneratedTextColumn _title;
  @override
  GeneratedTextColumn get title => _title ??= _constructTitle();
  GeneratedTextColumn _constructTitle() {
    return GeneratedTextColumn(
      'title',
      $tableName,
      false,
    );
  }

  final VerificationMeta _authorMeta = const VerificationMeta('author');
  GeneratedTextColumn _author;
  @override
  GeneratedTextColumn get author => _author ??= _constructAuthor();
  GeneratedTextColumn _constructAuthor() {
    return GeneratedTextColumn(
      'author',
      $tableName,
      true,
    );
  }

  final VerificationMeta _thumbnailMeta = const VerificationMeta('thumbnail');
  GeneratedBlobColumn _thumbnail;
  @override
  GeneratedBlobColumn get thumbnail => _thumbnail ??= _constructThumbnail();
  GeneratedBlobColumn _constructThumbnail() {
    return GeneratedBlobColumn(
      'thumbnail',
      $tableName,
      true,
    );
  }

  final VerificationMeta _durationMeta = const VerificationMeta('duration');
  GeneratedIntColumn _duration;
  @override
  GeneratedIntColumn get duration => _duration ??= _constructDuration();
  GeneratedIntColumn _constructDuration() {
    return GeneratedIntColumn(
      'duration',
      $tableName,
      false,
    );
  }

  @override
  List<GeneratedColumn> get $columns =>
      [id, title, author, thumbnail, duration];
  @override
  $BooksTable get asDslTable => this;
  @override
  String get $tableName => _alias ?? 'books';
  @override
  final String actualTableName = 'books';
  @override
  VerificationContext validateIntegrity(Insertable<Book> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id'], _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title'], _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('author')) {
      context.handle(_authorMeta,
          author.isAcceptableOrUnknown(data['author'], _authorMeta));
    }
    if (data.containsKey('thumbnail')) {
      context.handle(_thumbnailMeta,
          thumbnail.isAcceptableOrUnknown(data['thumbnail'], _thumbnailMeta));
    }
    context.handle(_durationMeta, const VerificationResult.success());
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Book map(Map<String, dynamic> data, {String tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : null;
    return Book.fromData(data, _db, prefix: effectivePrefix);
  }

  @override
  $BooksTable createAlias(String alias) {
    return $BooksTable(_db, alias);
  }

  static TypeConverter<Duration, int> $converter0 = DurationConverter();
}

class Chapter extends DataClass implements Insertable<Chapter> {
  final int id;
  final String title;
  final Duration duration;
  final String record;
  final int bookId;
  Chapter(
      {@required this.id,
      @required this.title,
      @required this.duration,
      this.record,
      @required this.bookId});
  factory Chapter.fromData(Map<String, dynamic> data, GeneratedDatabase db,
      {String prefix}) {
    final effectivePrefix = prefix ?? '';
    final intType = db.typeSystem.forDartType<int>();
    final stringType = db.typeSystem.forDartType<String>();
    return Chapter(
      id: intType.mapFromDatabaseResponse(data['${effectivePrefix}id']),
      title:
          stringType.mapFromDatabaseResponse(data['${effectivePrefix}title']),
      duration: $ChaptersTable.$converter0.mapToDart(
          intType.mapFromDatabaseResponse(data['${effectivePrefix}duration'])),
      record:
          stringType.mapFromDatabaseResponse(data['${effectivePrefix}record']),
      bookId:
          intType.mapFromDatabaseResponse(data['${effectivePrefix}book_id']),
    );
  }
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (!nullToAbsent || id != null) {
      map['id'] = Variable<int>(id);
    }
    if (!nullToAbsent || title != null) {
      map['title'] = Variable<String>(title);
    }
    if (!nullToAbsent || duration != null) {
      final converter = $ChaptersTable.$converter0;
      map['duration'] = Variable<int>(converter.mapToSql(duration));
    }
    if (!nullToAbsent || record != null) {
      map['record'] = Variable<String>(record);
    }
    if (!nullToAbsent || bookId != null) {
      map['book_id'] = Variable<int>(bookId);
    }
    return map;
  }

  ChaptersCompanion toCompanion(bool nullToAbsent) {
    return ChaptersCompanion(
      id: id == null && nullToAbsent ? const Value.absent() : Value(id),
      title:
          title == null && nullToAbsent ? const Value.absent() : Value(title),
      duration: duration == null && nullToAbsent
          ? const Value.absent()
          : Value(duration),
      record:
          record == null && nullToAbsent ? const Value.absent() : Value(record),
      bookId:
          bookId == null && nullToAbsent ? const Value.absent() : Value(bookId),
    );
  }

  factory Chapter.fromJson(Map<String, dynamic> json,
      {ValueSerializer serializer}) {
    serializer ??= moorRuntimeOptions.defaultSerializer;
    return Chapter(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      duration: serializer.fromJson<Duration>(json['duration']),
      record: serializer.fromJson<String>(json['record']),
      bookId: serializer.fromJson<int>(json['bookId']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer serializer}) {
    serializer ??= moorRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'duration': serializer.toJson<Duration>(duration),
      'record': serializer.toJson<String>(record),
      'bookId': serializer.toJson<int>(bookId),
    };
  }

  Chapter copyWith(
          {int id,
          String title,
          Duration duration,
          String record,
          int bookId}) =>
      Chapter(
        id: id ?? this.id,
        title: title ?? this.title,
        duration: duration ?? this.duration,
        record: record ?? this.record,
        bookId: bookId ?? this.bookId,
      );
  @override
  String toString() {
    return (StringBuffer('Chapter(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('duration: $duration, ')
          ..write('record: $record, ')
          ..write('bookId: $bookId')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => $mrjf($mrjc(
      id.hashCode,
      $mrjc(title.hashCode,
          $mrjc(duration.hashCode, $mrjc(record.hashCode, bookId.hashCode)))));
  @override
  bool operator ==(dynamic other) =>
      identical(this, other) ||
      (other is Chapter &&
          other.id == this.id &&
          other.title == this.title &&
          other.duration == this.duration &&
          other.record == this.record &&
          other.bookId == this.bookId);
}

class ChaptersCompanion extends UpdateCompanion<Chapter> {
  final Value<int> id;
  final Value<String> title;
  final Value<Duration> duration;
  final Value<String> record;
  final Value<int> bookId;
  const ChaptersCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.duration = const Value.absent(),
    this.record = const Value.absent(),
    this.bookId = const Value.absent(),
  });
  ChaptersCompanion.insert({
    this.id = const Value.absent(),
    @required String title,
    @required Duration duration,
    this.record = const Value.absent(),
    @required int bookId,
  })  : title = Value(title),
        duration = Value(duration),
        bookId = Value(bookId);
  static Insertable<Chapter> custom({
    Expression<int> id,
    Expression<String> title,
    Expression<int> duration,
    Expression<String> record,
    Expression<int> bookId,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (duration != null) 'duration': duration,
      if (record != null) 'record': record,
      if (bookId != null) 'book_id': bookId,
    });
  }

  ChaptersCompanion copyWith(
      {Value<int> id,
      Value<String> title,
      Value<Duration> duration,
      Value<String> record,
      Value<int> bookId}) {
    return ChaptersCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      duration: duration ?? this.duration,
      record: record ?? this.record,
      bookId: bookId ?? this.bookId,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (duration.present) {
      final converter = $ChaptersTable.$converter0;
      map['duration'] = Variable<int>(converter.mapToSql(duration.value));
    }
    if (record.present) {
      map['record'] = Variable<String>(record.value);
    }
    if (bookId.present) {
      map['book_id'] = Variable<int>(bookId.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('ChaptersCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('duration: $duration, ')
          ..write('record: $record, ')
          ..write('bookId: $bookId')
          ..write(')'))
        .toString();
  }
}

class $ChaptersTable extends Chapters with TableInfo<$ChaptersTable, Chapter> {
  final GeneratedDatabase _db;
  final String _alias;
  $ChaptersTable(this._db, [this._alias]);
  final VerificationMeta _idMeta = const VerificationMeta('id');
  GeneratedIntColumn _id;
  @override
  GeneratedIntColumn get id => _id ??= _constructId();
  GeneratedIntColumn _constructId() {
    return GeneratedIntColumn('id', $tableName, false,
        hasAutoIncrement: true, declaredAsPrimaryKey: true);
  }

  final VerificationMeta _titleMeta = const VerificationMeta('title');
  GeneratedTextColumn _title;
  @override
  GeneratedTextColumn get title => _title ??= _constructTitle();
  GeneratedTextColumn _constructTitle() {
    return GeneratedTextColumn(
      'title',
      $tableName,
      false,
    );
  }

  final VerificationMeta _durationMeta = const VerificationMeta('duration');
  GeneratedIntColumn _duration;
  @override
  GeneratedIntColumn get duration => _duration ??= _constructDuration();
  GeneratedIntColumn _constructDuration() {
    return GeneratedIntColumn(
      'duration',
      $tableName,
      false,
    );
  }

  final VerificationMeta _recordMeta = const VerificationMeta('record');
  GeneratedTextColumn _record;
  @override
  GeneratedTextColumn get record => _record ??= _constructRecord();
  GeneratedTextColumn _constructRecord() {
    return GeneratedTextColumn(
      'record',
      $tableName,
      true,
    );
  }

  final VerificationMeta _bookIdMeta = const VerificationMeta('bookId');
  GeneratedIntColumn _bookId;
  @override
  GeneratedIntColumn get bookId => _bookId ??= _constructBookId();
  GeneratedIntColumn _constructBookId() {
    return GeneratedIntColumn('book_id', $tableName, false,
        $customConstraints: 'REFERENCES books(id)');
  }

  @override
  List<GeneratedColumn> get $columns => [id, title, duration, record, bookId];
  @override
  $ChaptersTable get asDslTable => this;
  @override
  String get $tableName => _alias ?? 'chapters';
  @override
  final String actualTableName = 'chapters';
  @override
  VerificationContext validateIntegrity(Insertable<Chapter> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id'], _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title'], _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    context.handle(_durationMeta, const VerificationResult.success());
    if (data.containsKey('record')) {
      context.handle(_recordMeta,
          record.isAcceptableOrUnknown(data['record'], _recordMeta));
    }
    if (data.containsKey('book_id')) {
      context.handle(_bookIdMeta,
          bookId.isAcceptableOrUnknown(data['book_id'], _bookIdMeta));
    } else if (isInserting) {
      context.missing(_bookIdMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Chapter map(Map<String, dynamic> data, {String tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : null;
    return Chapter.fromData(data, _db, prefix: effectivePrefix);
  }

  @override
  $ChaptersTable createAlias(String alias) {
    return $ChaptersTable(_db, alias);
  }

  static TypeConverter<Duration, int> $converter0 = DurationConverter();
}

abstract class _$Database extends GeneratedDatabase {
  _$Database(QueryExecutor e) : super(SqlTypeSystem.defaultInstance, e);
  $BooksTable _books;
  $BooksTable get books => _books ??= $BooksTable(this);
  $ChaptersTable _chapters;
  $ChaptersTable get chapters => _chapters ??= $ChaptersTable(this);
  BooksDao _booksDao;
  BooksDao get booksDao => _booksDao ??= BooksDao(this as Database);
  @override
  Iterable<TableInfo> get allTables => allSchemaEntities.whereType<TableInfo>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities => [books, chapters];
}
