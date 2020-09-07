import 'dart:math';
import 'dart:ui';

import 'package:audiobooks_flutter/utils/spacing.dart';
import 'package:flutter/material.dart';

final _light = Colors.grey.shade300;
final _dark = Colors.grey.shade500;

class DurationBar extends StatelessWidget {
  final List<Duration> durations;
  final Duration _total;
  final double fillAmount;
  final double spacing;

  final Color light;
  final Color dark;

  DurationBar({
    Key key,
    @required this.durations,
    this.fillAmount = 0,
    this.spacing = 2,
    this.light,
    this.dark,
  })  : _total = durations.reduce((value, element) => value + element),
        super(key: key);

  @override
  Widget build(BuildContext context) {
    final _totalInSeconds = _total.inSeconds;
    final _lengths = durations.map((e) => e.inSeconds / _totalInSeconds).where((element) => element != 0).toList();
    return ClipPath(
      clipper: const ShapeBorderClipper(shape: StadiumBorder()),
      child: SizedBox(
        width: double.infinity,
        child: LayoutBuilder(
          builder: (context, constraints) => Row(
            children: _lengths
                .asMap()
                .entries
                .map(
                  (e) {
                    print(e.value);
                    if (_lengths.length == 1) {
                      return Stack(
                        children: [
                          Container(
                            width: max(e.value * constraints.maxWidth, 0),
                            height: 4,
                            color: light ?? _light,
                          ),
                          Container(
                            width: max(fillAmount * constraints.maxWidth, 0),
                            height: 3,
                            color: dark ?? _dark,
                          )
                        ],
                      );
                    }

                    var isFilled =
                        _lengths.take(e.key + 1).reduce((value, element) => value + element) < fillAmount;
                    var temp = _lengths.take(e.key);
                    var isSemiFilled = !isFilled &&
                        (temp.length > 0 ? temp.reduce((value, element) => value + element) : 0) < fillAmount;
                    return Stack(
                      children: [
                        isFilled
                            ? Container(
                                width: max(e.value * (constraints.maxWidth - (_lengths.length - 1) * spacing), 0),
                                height: 4,
                                color: dark ?? _dark,
                              )
                            : Container(
                                width: max(e.value * (constraints.maxWidth - (_lengths.length - 1) * spacing), 0),
                                height: 4,
                                color: light ?? _light,
                              ),
                        if (isSemiFilled)
                          Container(
                            width: min(
                              max(e.value * (constraints.maxWidth - (_lengths.length - 1) * spacing), 0),
                              max(
                                      fillAmount -
                                          (_lengths.take(e.key).length == 0
                                              ? 0
                                              : _lengths.take(e.key).reduce(
                                                    (value, element) => value + element,
                                                  )),
                                      0) *
                                  (constraints.maxWidth - (_lengths.length) * spacing),
                            ),
                            height: 4,
                            color: dark ?? _dark,
                          )
                      ],
                    );
                  },
                )
                .cast<Widget>()
                .spacedBy(SizedBox(width: spacing))
                .toList(),
          ),
        ),
      ),
    );
  }
}
