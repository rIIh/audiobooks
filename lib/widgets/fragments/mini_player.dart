import 'package:audiobooks_flutter/bloc/player_cubit.dart';
import 'package:audiobooks_flutter/main.dart';
import 'package:audiobooks_flutter/state/player_state.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../text/Caption.dart';

class MiniPlayer extends StatefulWidget {
  final PlayerCubit cubit;

  const MiniPlayer({Key key, @required this.cubit}) : super(key: key);

  @override
  _MiniPlayerState createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> with SingleTickerProviderStateMixin {
  @override
  Widget build(BuildContext context) {
    return AnimatedSize(
      vsync: this,
      duration: Duration(milliseconds: 200),
      child: BlocBuilder(
        cubit: widget.cubit,
        builder: (context, PlayerState state) => state.map(
          stopped: (_) => Container(),
          playing: _buildView,
          paused: _buildView,
        ),
      ),
    );
  }

  Widget _buildView(PlayerState state) => Container(
        height: 64,
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withAlpha(45),
              blurRadius: 4,
              spreadRadius: 1,
            ),
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
                      onPressed: () {},
                    ),
                    IconButton(
                      icon: Icon(Icons.pause),
                      color: Colors.black,
                      onPressed: () {},
                      hoverColor: Colors.grey,
                    )
                  ],
                ),
              ),
              state.maybeMap(
                playing: _buildProgressBar,
                paused: _buildProgressBar,
                orElse: () => Container(),
              ),
            ],
          ),
        ),
      );

  Widget _buildProgressBar(PlayingProgress target) => Positioned(
        left: -3,
        right: -3,
        bottom: -3,
        child: FractionallySizedBox(
          widthFactor: target.progress,
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
      );
}
