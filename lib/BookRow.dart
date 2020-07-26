import 'package:audiobooks_flutter/BookCard.dart';
import 'package:audiobooks_flutter/text/Caption.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class BookRow extends StatelessWidget {
  final bool active;

  Color get currentColor {
    return active ? Colors.white : Colors.black;
  }

  BookRow({this.active = false});

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
                    'Title'.toUpperCase(),
                    style: TextStyle(
                        color: currentColor, fontWeight: FontWeight.bold),
                  ),
                  Caption('Author'),
                  Caption('Duration'),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Center(
              child: Container(
                decoration: BoxDecoration(
                    border: Border.all(color: currentColor),
                    shape: BoxShape.circle),
                child: IconButton(
                  icon: Icon(
                    Icons.play_arrow,
                  ),
                  color: currentColor,
                  splashColor: currentColor.withAlpha(128),
                  onPressed: () => print('Hello world'),
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
