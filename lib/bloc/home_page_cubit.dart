import 'package:audiobooks_flutter/model/internal/database/dao.dart';
import 'package:audiobooks_flutter/state/home_page_state.dart';
import 'package:bloc/bloc.dart';
import 'package:koin/koin.dart';

class HomePageCubit extends Cubit<HomePageState> with KoinComponentMixin {
  BooksDao _dao;

  HomePageCubit() : super(HomePageState.loading()) {
    _dao = get();
    _dao.watchAll().listen((event) => emit(HomePageState.loaded(event)));
  }
}
