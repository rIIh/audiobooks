import 'package:audiobooks_flutter/bloc/home_page_cubit.dart';
import 'package:audiobooks_flutter/bloc/player_cubit.dart';
import 'package:audiobooks_flutter/state/home_page_state.dart';
import 'package:audiobooks_flutter/widgets/fragments/add_book_sheet.dart';
import 'package:audiobooks_flutter/widgets/fragments/book_card.dart';
import 'package:audiobooks_flutter/widgets/fragments/book_tile.dart';
import 'package:audiobooks_flutter/widgets/fragments/mini_player.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:koin_flutter/koin_flutter.dart';

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key}) : super(key: key);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> with ScopeStateMixin {
  HomePageCubit _homePageCubit;
  PlayerCubit _playerCubit;
  int _selectedIndex = 0;

  @override
  void initState() {
    super.initState();
    _playerCubit = currentScope.get();
    _homePageCubit = currentScope.get();
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  void _showAddSheet() => CreateBookSheet.show(context);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AudioBooks'),
        actions: [
          IconButton(icon: Icon(Icons.add), onPressed: _showAddSheet)
        ],
      ),
      body: Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          children: <Widget>[
            Expanded(
              child: ListView(
                children: <Widget>[
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    child: Text('Recent'),
                  ),
                  ConstrainedBox(
                    constraints: BoxConstraints(maxHeight: 146),
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: EdgeInsets.symmetric(horizontal: 14),
                      itemBuilder: (context, index) => BookCard(
                        height: 126,
                      ),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    child: BlocBuilder(
                      cubit: _homePageCubit,
                      builder: (context, HomePageState state) => state.map(
                        loading: (_) => Center(
                          child: CircularProgressIndicator(),
                        ),
                        loaded: (value) => Column(
                          children: value.books.map(
                                (book) => BookTile(
                              book: book,
                            ),
                          ).toList(),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            MiniPlayer(
              cubit: _playerCubit,
            ),
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: Icon(
                Icons.home,
                size: 24,
              ),
              title: Text('')),
          BottomNavigationBarItem(icon: Icon(Icons.layers), title: Text('')),
          BottomNavigationBarItem(icon: Icon(Icons.code), title: Text('')),
        ],
        showSelectedLabels: false,
        showUnselectedLabels: false,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
