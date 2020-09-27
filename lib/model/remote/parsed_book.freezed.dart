// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies

part of 'parsed_book.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;
ParsedBook _$ParsedBookFromJson(Map<String, dynamic> json) {
  return _ParsedBook.fromJson(json);
}

class _$ParsedBookTearOff {
  const _$ParsedBookTearOff();

// ignore: unused_element
  _ParsedBook call(String title, String author, String thumbnail,
      List<ParsedChapter> chapters) {
    return _ParsedBook(
      title,
      author,
      thumbnail,
      chapters,
    );
  }
}

// ignore: unused_element
const $ParsedBook = _$ParsedBookTearOff();

mixin _$ParsedBook {
  String get title;
  String get author;
  String get thumbnail;
  List<ParsedChapter> get chapters;

  Map<String, dynamic> toJson();
  $ParsedBookCopyWith<ParsedBook> get copyWith;
}

abstract class $ParsedBookCopyWith<$Res> {
  factory $ParsedBookCopyWith(
          ParsedBook value, $Res Function(ParsedBook) then) =
      _$ParsedBookCopyWithImpl<$Res>;
  $Res call(
      {String title,
      String author,
      String thumbnail,
      List<ParsedChapter> chapters});
}

class _$ParsedBookCopyWithImpl<$Res> implements $ParsedBookCopyWith<$Res> {
  _$ParsedBookCopyWithImpl(this._value, this._then);

  final ParsedBook _value;
  // ignore: unused_field
  final $Res Function(ParsedBook) _then;

  @override
  $Res call({
    Object title = freezed,
    Object author = freezed,
    Object thumbnail = freezed,
    Object chapters = freezed,
  }) {
    return _then(_value.copyWith(
      title: title == freezed ? _value.title : title as String,
      author: author == freezed ? _value.author : author as String,
      thumbnail: thumbnail == freezed ? _value.thumbnail : thumbnail as String,
      chapters: chapters == freezed
          ? _value.chapters
          : chapters as List<ParsedChapter>,
    ));
  }
}

abstract class _$ParsedBookCopyWith<$Res> implements $ParsedBookCopyWith<$Res> {
  factory _$ParsedBookCopyWith(
          _ParsedBook value, $Res Function(_ParsedBook) then) =
      __$ParsedBookCopyWithImpl<$Res>;
  @override
  $Res call(
      {String title,
      String author,
      String thumbnail,
      List<ParsedChapter> chapters});
}

class __$ParsedBookCopyWithImpl<$Res> extends _$ParsedBookCopyWithImpl<$Res>
    implements _$ParsedBookCopyWith<$Res> {
  __$ParsedBookCopyWithImpl(
      _ParsedBook _value, $Res Function(_ParsedBook) _then)
      : super(_value, (v) => _then(v as _ParsedBook));

  @override
  _ParsedBook get _value => super._value as _ParsedBook;

  @override
  $Res call({
    Object title = freezed,
    Object author = freezed,
    Object thumbnail = freezed,
    Object chapters = freezed,
  }) {
    return _then(_ParsedBook(
      title == freezed ? _value.title : title as String,
      author == freezed ? _value.author : author as String,
      thumbnail == freezed ? _value.thumbnail : thumbnail as String,
      chapters == freezed ? _value.chapters : chapters as List<ParsedChapter>,
    ));
  }
}

@JsonSerializable()
class _$_ParsedBook implements _ParsedBook {
  _$_ParsedBook(this.title, this.author, this.thumbnail, this.chapters)
      : assert(title != null),
        assert(author != null),
        assert(thumbnail != null),
        assert(chapters != null);

  factory _$_ParsedBook.fromJson(Map<String, dynamic> json) =>
      _$_$_ParsedBookFromJson(json);

  @override
  final String title;
  @override
  final String author;
  @override
  final String thumbnail;
  @override
  final List<ParsedChapter> chapters;

  bool _didduration = false;
  Duration _duration;

  @override
  Duration get duration {
    if (_didduration == false) {
      _didduration = true;
      _duration = chapters.map((e) => e.duration).map(parseHHMMSS).reduce(
            (value, element) => value + element,
          );
    }
    return _duration;
  }

  @override
  String toString() {
    return 'ParsedBook(title: $title, author: $author, thumbnail: $thumbnail, chapters: $chapters, duration: $duration)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is _ParsedBook &&
            (identical(other.title, title) ||
                const DeepCollectionEquality().equals(other.title, title)) &&
            (identical(other.author, author) ||
                const DeepCollectionEquality().equals(other.author, author)) &&
            (identical(other.thumbnail, thumbnail) ||
                const DeepCollectionEquality()
                    .equals(other.thumbnail, thumbnail)) &&
            (identical(other.chapters, chapters) ||
                const DeepCollectionEquality()
                    .equals(other.chapters, chapters)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^
      const DeepCollectionEquality().hash(title) ^
      const DeepCollectionEquality().hash(author) ^
      const DeepCollectionEquality().hash(thumbnail) ^
      const DeepCollectionEquality().hash(chapters);

  @override
  _$ParsedBookCopyWith<_ParsedBook> get copyWith =>
      __$ParsedBookCopyWithImpl<_ParsedBook>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$_$_ParsedBookToJson(this);
  }
}

abstract class _ParsedBook implements ParsedBook {
  factory _ParsedBook(String title, String author, String thumbnail,
      List<ParsedChapter> chapters) = _$_ParsedBook;

  factory _ParsedBook.fromJson(Map<String, dynamic> json) =
      _$_ParsedBook.fromJson;

  @override
  String get title;
  @override
  String get author;
  @override
  String get thumbnail;
  @override
  List<ParsedChapter> get chapters;
  @override
  _$ParsedBookCopyWith<_ParsedBook> get copyWith;
}

ParsedChapter _$ParsedChapterFromJson(Map<String, dynamic> json) {
  return _ParsedChapter.fromJson(json);
}

class _$ParsedChapterTearOff {
  const _$ParsedChapterTearOff();

// ignore: unused_element
  _ParsedChapter call(String title, String downloadUrl, String duration) {
    return _ParsedChapter(
      title,
      downloadUrl,
      duration,
    );
  }
}

// ignore: unused_element
const $ParsedChapter = _$ParsedChapterTearOff();

mixin _$ParsedChapter {
  String get title;
  String get downloadUrl;
  String get duration;

  Map<String, dynamic> toJson();
  $ParsedChapterCopyWith<ParsedChapter> get copyWith;
}

abstract class $ParsedChapterCopyWith<$Res> {
  factory $ParsedChapterCopyWith(
          ParsedChapter value, $Res Function(ParsedChapter) then) =
      _$ParsedChapterCopyWithImpl<$Res>;
  $Res call({String title, String downloadUrl, String duration});
}

class _$ParsedChapterCopyWithImpl<$Res>
    implements $ParsedChapterCopyWith<$Res> {
  _$ParsedChapterCopyWithImpl(this._value, this._then);

  final ParsedChapter _value;
  // ignore: unused_field
  final $Res Function(ParsedChapter) _then;

  @override
  $Res call({
    Object title = freezed,
    Object downloadUrl = freezed,
    Object duration = freezed,
  }) {
    return _then(_value.copyWith(
      title: title == freezed ? _value.title : title as String,
      downloadUrl:
          downloadUrl == freezed ? _value.downloadUrl : downloadUrl as String,
      duration: duration == freezed ? _value.duration : duration as String,
    ));
  }
}

abstract class _$ParsedChapterCopyWith<$Res>
    implements $ParsedChapterCopyWith<$Res> {
  factory _$ParsedChapterCopyWith(
          _ParsedChapter value, $Res Function(_ParsedChapter) then) =
      __$ParsedChapterCopyWithImpl<$Res>;
  @override
  $Res call({String title, String downloadUrl, String duration});
}

class __$ParsedChapterCopyWithImpl<$Res>
    extends _$ParsedChapterCopyWithImpl<$Res>
    implements _$ParsedChapterCopyWith<$Res> {
  __$ParsedChapterCopyWithImpl(
      _ParsedChapter _value, $Res Function(_ParsedChapter) _then)
      : super(_value, (v) => _then(v as _ParsedChapter));

  @override
  _ParsedChapter get _value => super._value as _ParsedChapter;

  @override
  $Res call({
    Object title = freezed,
    Object downloadUrl = freezed,
    Object duration = freezed,
  }) {
    return _then(_ParsedChapter(
      title == freezed ? _value.title : title as String,
      downloadUrl == freezed ? _value.downloadUrl : downloadUrl as String,
      duration == freezed ? _value.duration : duration as String,
    ));
  }
}

@JsonSerializable()
class _$_ParsedChapter implements _ParsedChapter {
  const _$_ParsedChapter(this.title, this.downloadUrl, this.duration)
      : assert(title != null),
        assert(downloadUrl != null),
        assert(duration != null);

  factory _$_ParsedChapter.fromJson(Map<String, dynamic> json) =>
      _$_$_ParsedChapterFromJson(json);

  @override
  final String title;
  @override
  final String downloadUrl;
  @override
  final String duration;

  @override
  String toString() {
    return 'ParsedChapter(title: $title, downloadUrl: $downloadUrl, duration: $duration)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is _ParsedChapter &&
            (identical(other.title, title) ||
                const DeepCollectionEquality().equals(other.title, title)) &&
            (identical(other.downloadUrl, downloadUrl) ||
                const DeepCollectionEquality()
                    .equals(other.downloadUrl, downloadUrl)) &&
            (identical(other.duration, duration) ||
                const DeepCollectionEquality()
                    .equals(other.duration, duration)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^
      const DeepCollectionEquality().hash(title) ^
      const DeepCollectionEquality().hash(downloadUrl) ^
      const DeepCollectionEquality().hash(duration);

  @override
  _$ParsedChapterCopyWith<_ParsedChapter> get copyWith =>
      __$ParsedChapterCopyWithImpl<_ParsedChapter>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$_$_ParsedChapterToJson(this);
  }
}

abstract class _ParsedChapter implements ParsedChapter {
  const factory _ParsedChapter(
      String title, String downloadUrl, String duration) = _$_ParsedChapter;

  factory _ParsedChapter.fromJson(Map<String, dynamic> json) =
      _$_ParsedChapter.fromJson;

  @override
  String get title;
  @override
  String get downloadUrl;
  @override
  String get duration;
  @override
  _$ParsedChapterCopyWith<_ParsedChapter> get copyWith;
}
