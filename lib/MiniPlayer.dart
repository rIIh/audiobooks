import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

import 'text/Caption.dart';

class MiniPlayer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
              color: Colors.grey.withAlpha(45), blurRadius: 4, spreadRadius: 1)
        ],
        color: Colors.white,
      ),
      child: Material(
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text('Some long title'),
                        Caption('Author/duration/time'),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.play_arrow),
                    color: Colors.black,
                    onPressed: () => {},
                  ),
                  IconButton(
                    icon: Icon(Icons.pause),
                    color: Colors.black,
                    onPressed: () => {},
                    hoverColor: Colors.grey,
                  )
                ],
              ),
            ),
            Positioned(
              left: -3,
              right: -3,
              bottom: -3,
              child: FractionallySizedBox(
                widthFactor: 0.56,
                alignment: Alignment.centerLeft,
                child: Container(
                  height: 6,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.all(
                      Radius.circular(3),
                    ),
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
