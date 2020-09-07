import 'package:audiobooks_flutter/service/parsing_strategy_resolver.dart';
import 'package:koin/koin.dart';
import 'package:koin_bloc/koin_bloc.dart';

import '../bloc/create_book_cubit.dart';
import '../bloc/home_page_cubit.dart';
import '../bloc/player_cubit.dart';
import '../model/internal/dao.dart';
import '../model/internal/database.dart';
import '../service/book_parser_service.dart';
import '../widgets/fragments/add_book_sheet.dart';
import '../widgets/pages/home_page.dart';

final mainModule = module()
  ..scope<MyHomePage>((dsl) => dsl..scopedCubit((scope) => PlayerCubit())..scopedCubit((scope) => HomePageCubit()))
  ..scope<CreateBookSheet>((dsl) => dsl..scopedCubit((scope) => CreateBookCubit()))
  ..single((scope) => Database())
  ..single((scope) => BooksDao(scope.get()))
  ..single((scope) => BookLoaderService());

final strategies = module()
  ..scope<LoadingStrategyResolver>(
    (dsl) => dsl..scoped<LoadingStrategy>((scope) => AknigaLoadingStrategy()),
  )
  ..single((scope) => LoadingStrategyResolver());
