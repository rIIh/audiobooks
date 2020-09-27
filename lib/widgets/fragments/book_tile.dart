import 'package:audiobooks_flutter/bloc/book_cubit.dart';
import 'package:audiobooks_flutter/model/internal/database/dao.dart';
import 'package:audiobooks_flutter/model/internal/models/book_with_chapters.dart';
import 'package:audiobooks_flutter/state/book_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../bloc/player_cubit.dart';
import '../../state/player_state.dart';
import '../../text/Caption.dart';
import 'book_card.dart';

class BookTile extends StatelessWidget {
  final bool active;
  final BookWithChapters data;
  final BooksDao dao;
  final PlayerCubit playerCubit;
  final BookCubit bookCubit;

  Color get currentColor {
    return active ? Colors.white : Colors.black;
  }

  BookTile({this.active = false, @required this.data, this.playerCubit, this.dao}) : bookCubit = BookCubit(data);

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? Colors.black : null,
      borderRadius: BorderRadius.circular(12),
      child: Row(
        children: <Widget>[
          BookCard(
            height: 96,
            image: MemoryImage(data.book.thumbnail),
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    data.book.title.toUpperCase(),
                    style: TextStyle(color: currentColor, fontWeight: FontWeight.w500),
                  ),
                  Caption(data.book.author),
                  Caption(data.duration.toString()),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Center(
              child: Container(
                decoration: BoxDecoration(border: Border.all(color: currentColor), shape: BoxShape.circle),
                child: BlocBuilder<BookCubit, BookState>(
                  cubit: bookCubit,
                  builder: (context, state) => state.maybeMap(
                    preparing: (value) => CircularProgressIndicator(
                      strokeWidth: 1.5,
                      valueColor: AlwaysStoppedAnimation(Colors.black),
                    ),
                    missingCache: (value) => IconButton(icon: Icon(Icons.keyboard_arrow_down), onPressed: () {}),
                    downloading: (value) => CircularProgressIndicator(
                      strokeWidth: 2,
                      value: value.progress,
                      valueColor: AlwaysStoppedAnimation(Colors.black),
                    ),
                    valid: (value) => playerCubit != null
                        ? BlocBuilder(
                            cubit: playerCubit,
                            builder: (context, PlayerState state) => IconButton(
                              icon: Icon(
                                Icons.play_arrow,
                              ),
                              color: currentColor,
                              splashColor: currentColor.withAlpha(128), onPressed: () {},
                              // onPressed: state.map(stopped: (_) => playerCubit.play(), playing: null, paused: null),
                            ),
                          )
                        : Container(),
                    orElse: () => Container(),
                  ),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
