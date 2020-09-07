import 'package:audiobooks_flutter/bloc/player_cubit.dart';
import 'package:audiobooks_flutter/model/internal/database.dart';
import 'package:audiobooks_flutter/state/player_state.dart';
import 'package:audiobooks_flutter/widgets/fragments/book_card.dart';
import 'package:audiobooks_flutter/text/Caption.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class BookTile extends StatelessWidget {
  final bool active;
  final Book book;
  final PlayerCubit playerCubit;

  Color get currentColor {
    return active ? Colors.white : Colors.black;
  }

  BookTile({this.active = false, @required this.book, this.playerCubit});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: active ? Colors.black : null,
      borderRadius: BorderRadius.circular(12),
      child: Row(
        children: <Widget>[
          BookCard(
            height: 96,
          ),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    book.title.toUpperCase(),
                    style: TextStyle(color: currentColor, fontWeight: FontWeight.bold),
                  ),
                  Caption(book.author),
                  Caption(book.duration.toString()),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Center(
              child: Container(
                decoration: BoxDecoration(border: Border.all(color: currentColor), shape: BoxShape.circle),
                child: playerCubit != null ? BlocBuilder(
                  cubit: playerCubit,
                  builder: (context, PlayerState state) => IconButton(
                    icon: Icon(
                      Icons.play_arrow,
                    ),
                    color: currentColor,
                    splashColor: currentColor.withAlpha(128), onPressed: () {  },
                    // onPressed: state.map(stopped: (_) => playerCubit.play(), playing: null, paused: null),
                  ),
                ) : Container(),
              ),
            ),
          )
        ],
      ),
    );
  }
}
