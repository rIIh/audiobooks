import 'dart:math';
import 'dart:ui';

import 'package:flushbar/flushbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:koin_flutter/koin_flutter.dart';

import '../../bloc/create_book_cubit.dart';
import '../../state/create_book_state.dart';
import 'duration_bar.dart';

class CreateBookSheet extends StatefulWidget {
  static void show(BuildContext context) => showModalBottomSheet<void>(
        context: context,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(
            top: Radius.circular(24),
          ),
        ),
        builder: (context) => CreateBookSheet(),
      );

  @override
  _CreateBookSheetState createState() => _CreateBookSheetState();
}

class _CreateBookSheetState extends State<CreateBookSheet> with ScopeStateMixin, SingleTickerProviderStateMixin {
  CreateBookCubit _cubit;
  TextEditingController _controller;
  FocusNode _focusNode;

  @override
  void initState() {
    super.initState();
    _cubit = currentScope.get();
    _cubit.listen(
      (event) => event.maybeMap(
        waiting: (_) => _controller.text = '',
        created: (_) => Navigator.of(context).maybePop(),
        orElse: () => null,
      ),
    );
    _controller = TextEditingController();
    _focusNode = FocusNode();

    _focusNode.addListener(() {
      if (_focusNode.hasPrimaryFocus) {
        _cubit.focused();
      }
    });
  }

  final Color grey = Colors.grey.shade400;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(24.0).add(
        EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconTheme(
            data: IconThemeData(
              color: grey,
              size: 18,
            ),
            child: SizedBox(
              height: 48,
              child: DecoratedBox(
                decoration: ShapeDecoration(
                  shape: StadiumBorder(),
                  color: Colors.grey.shade200,
                ),
                child: Padding(
                  padding: const EdgeInsets.all(15.0),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.link,
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      Expanded(
                        child: BlocBuilder(
                          cubit: _cubit,
                          builder: (context, state) => TextField(
                            decoration: InputDecoration(
                              border: InputBorder.none,
                              hintText: 'Place URL here',
                              hintStyle: TextStyle(
                                color: grey,
                              ),
                              isCollapsed: true,
                            ),
                            enabled: _cubit.isEditable,
                            controller: _controller,
                            onChanged: _cubit.textChanged,
                            focusNode: _focusNode,
                          ),
                        ),
                      ),
                      const SizedBox(
                        width: 10,
                      ),
                      BlocBuilder(
                        cubit: _cubit,
                        builder: (context, CreateBookState state) => state.maybeMap(
                          waiting: (_) => GestureDetector(
                            // onTap: _cubit.submit,
                            child: Icon(
                              Icons.info_outline,
                            ),
                          ),
                          hasInput: (_) => GestureDetector(
                            onTap: () => _cubit.submit().catchError(
                                  (error) => Flushbar(
                                    message: error.toString(),
                                    backgroundColor: Theme.of(context).errorColor,
                                    flushbarPosition: FlushbarPosition.TOP,
                                    flushbarStyle: FlushbarStyle.GROUNDED,
                                    duration: Duration(seconds: 3),
                                  )..show(context),
                                ),
                            child: Icon(
                              Icons.navigate_next,
                            ),
                          ),
                          loading: (_) => SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(
                              strokeWidth: 1,
                            ),
                          ),
                          loaded: (_) => GestureDetector(
                            onTap: _cubit.drop,
                            child: Icon(
                              Icons.close,
                            ),
                          ),
                          orElse: () => Container(),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          AnimatedSize(
            duration: Duration(milliseconds: 200),
            alignment: Alignment.topCenter,
            vsync: this,
            child: BlocBuilder(
              cubit: _cubit,
              builder: (context, CreateBookState state) => state.maybeMap(
                loaded: (value) => Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const SizedBox(
                      height: 20,
                    ),
                    Row(
                      children: [
                        if (value.bookCandidate.thumbnail != null)
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Stack(
                              children: [
                                ImageFiltered(
                                  imageFilter: ImageFilter.blur(sigmaX: 1.5, sigmaY: 1.5),
                                  child: Image.network(
                                    value.bookCandidate.thumbnail,
                                    height: 66,
                                    fit: BoxFit.cover,
                                    width: 66,
                                  ),
                                ),
                                Image.network(
                                  value.bookCandidate.thumbnail,
                                  height: 66,
                                  width: 66,
                                ),
                              ]
                            ),
                          ),
                        const SizedBox(
                          width: 18,
                        ),
                        Expanded(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                value.bookCandidate.title ?? 'Title',
                                style: TextStyle(
                                  color: Colors.black,
                                  fontSize: 16,
                                  fontFamily: "Roboto",
                                  fontWeight: FontWeight.w400,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                value.bookCandidate.author ?? 'Author',
                                style: TextStyle(
                                  color: Color(0x99000000),
                                  fontSize: 14,
                                  fontFamily: "Roboto",
                                  fontWeight: FontWeight.w300,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                value.bookCandidate.duration?.toString() ?? 'Duration',
                                style: TextStyle(
                                  color: Color(0x99000000),
                                  fontSize: 14,
                                  fontFamily: "Roboto",
                                  fontWeight: FontWeight.w300,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(
                          width: 12,
                        ),
                        Icon(Icons.label_outline),
                        const SizedBox(
                          width: 12,
                        ),
                        GestureDetector(
                          onTap: _cubit.save,
                          child: Icon(Icons.add),
                        ),
                      ],
                    ),
                    const SizedBox(
                      height: 16,
                    ),
                    DurationBar(
                      durations: value.bookCandidate.chapters.map((e) => e.duration).map(parseHHMMSS).toList(),
                      spacing: 1.5,
                      light: grey.withOpacity(0.5),
                    )
                  ],
                ),
                orElse: () => Container(),
              ),
            ),
          )
        ],
      ),
    );
  }
}
