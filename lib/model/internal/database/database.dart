import 'dart:io';

import 'package:moor/ffi.dart';
import 'package:moor/moor.dart';
import 'package:path_provider/path_provider.dart';
import 'package:path/path.dart' as Path;

import 'cache_dao.dart';
import 'dao.dart';
import 'tables.dart';

part 'database.g.dart';

LazyDatabase _openConnection({String database}) {
  return LazyDatabase(() async {
    final dbFolder = await getApplicationDocumentsDirectory();
    final file = File(Path.join(dbFolder.path, database ?? 'db.sqlite'));
    return VmDatabase(file, logStatements: true);
  });
}

@UseMoor(tables: [Books, Chapters, DownloadCacheEntries], daos: [BooksDao, CachesDao])
class Database extends _$Database {
  Database({String database}) : super(_openConnection(database: database));

  @override
  int get schemaVersion => 1;
}
