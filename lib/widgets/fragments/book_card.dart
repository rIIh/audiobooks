import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/widgets.dart';

class BookCard extends StatelessWidget {
  final double height;
  final int cached = Random().nextInt(1000000);

  BookCard({this.height = 156}) : super();

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(10),
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Container(
        width: height * 0.6,
        height: height,
//        child: Image.network('https://source.unsplash.com/random/154x256\?data=$cached'),
      ),
    );
  }
}
