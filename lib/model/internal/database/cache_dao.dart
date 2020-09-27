import 'package:moor/moor.dart';

import 'database.dart';
import 'tables.dart';

part 'cache_dao.g.dart';

@UseDao(tables: [Caches])
class CachesDao extends DatabaseAccessor<Database> with _$CachesDaoMixin {
  CachesDao(Database db) : super(db);
}
