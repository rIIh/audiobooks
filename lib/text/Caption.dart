import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

class Caption extends StatelessWidget {
  final String data;

  Caption(this.data);

  @override
  Widget build(BuildContext context) {
    return DefaultTextStyle(
        style: TextStyle(
          color: Colors.grey,
        ),
        child: Text(data));
  }
}
