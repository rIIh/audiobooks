// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'parsed_book.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$_ParsedBook _$_$_ParsedBookFromJson(Map<String, dynamic> json) {
  return _$_ParsedBook(
    json['title'] as String,
    json['author'] as String,
    json['thumbnail'] as String,
    (json['chapters'] as List)
        ?.map((e) => e == null
            ? null
            : ParsedChapter.fromJson(e as Map<String, dynamic>))
        ?.toList(),
  );
}

Map<String, dynamic> _$_$_ParsedBookToJson(_$_ParsedBook instance) =>
    <String, dynamic>{
      'title': instance.title,
      'author': instance.author,
      'thumbnail': instance.thumbnail,
      'chapters': instance.chapters,
    };

_$_ParsedChapter _$_$_ParsedChapterFromJson(Map<String, dynamic> json) {
  return _$_ParsedChapter(
    json['title'] as String,
    json['downloadUrl'] as String,
    json['duration'] as String,
  );
}

Map<String, dynamic> _$_$_ParsedChapterToJson(_$_ParsedChapter instance) =>
    <String, dynamic>{
      'title': instance.title,
      'downloadUrl': instance.downloadUrl,
      'duration': instance.duration,
    };
