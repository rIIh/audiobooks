import 'dart:math';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/painting.dart';
import 'package:flutter/widgets.dart';

const double _borderRadius = 12;

class BookCard extends StatelessWidget {
  final double height;
  final ImageProvider image;

  BookCard({this.height = 156, this.image}) : super();

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.all(10),
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_borderRadius)),
      child: ClipPath(
        clipper: ShapeBorderClipper(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_borderRadius)),
        ),
        child: Container(
          width: height * 0.6,
          height: height,
          child: image != null
              ? Stack(
                  overflow: Overflow.clip,
                  alignment: Alignment.center,
                  children: [
                    ImageFiltered(
                      imageFilter: ImageFilter.blur(sigmaX: 1.5, sigmaY: 1.5),
                      child: Image(
                        image: image,
                        fit: BoxFit.cover,
                        height: double.infinity,
                        width: double.infinity,
                      ),
                    ),
                    Image(
                      image: image,
                    ),
                  ],
                )
              : null,
        ),
      ),
    );
  }
}
