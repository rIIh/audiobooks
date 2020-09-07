import 'dart:async';
import 'dart:convert';

import 'package:audiobooks_flutter/model/remote/parsed_book.dart';
import 'package:audiobooks_flutter/service/parsing_strategy_resolver.dart';
import 'package:flutter/services.dart';
import 'package:flutter_inappwebview/flutter_inappwebview.dart';
import 'package:koin/koin.dart';

abstract class LoadingStrategy {
  const LoadingStrategy();

  Future<String> parse(String url);

  String get target;
}

class AknigaLoadingStrategy implements LoadingStrategy {
  const AknigaLoadingStrategy();

  @override
  Future<String> parse(String url) async {
    final script = await rootBundle.loadString('assets/scripts/akniga_parsing_script.js');
    String json;
    HeadlessInAppWebView headlessWebView;
    var resolver = Completer<String>();
    headlessWebView = HeadlessInAppWebView(
      initialUrl: url,
      onWebViewCreated: (controller) => controller
        ..addJavaScriptHandler(
          handlerName: 'success',
          callback: (arguments) {
            json = arguments.first;
            print(json);
            resolver.complete(json);
            headlessWebView.dispose();
          },
        )
        ..addJavaScriptHandler(
          handlerName: 'failed',
          callback: (arguments) {
            resolver.completeError(arguments.first);
            headlessWebView.dispose();
          },
        ),
      onLoadStop: (controller, url) {
        print('Loaded');
        return controller
          ..evaluateJavascript(
            source: script,
          );
      },
    )..run();
    Timer(Duration(seconds: 30), () {
      if (resolver.isCompleted == false) {
        resolver.completeError(StateError('Timeout error'));
      }
      headlessWebView.dispose();
    });
    return resolver.future;
  }

  @override
  String get target => 'akniga.org';
}

class BookLoaderService with KoinComponentMixin {
  LoadingStrategyResolver _strategyResolver;

  BookLoaderService() {
    _strategyResolver = get();
  }

  bool validate(String url) => _strategyResolver.resolve(url) != null;

  Future<ParsedBook> loadBook(
    String url, {
    LoadingStrategy strategy = const AknigaLoadingStrategy(),
  }) async {
    final strategy = _strategyResolver.resolve(url);
    if (strategy != null) {
      final json = await strategy.parse(url);
      return ParsedBook.fromJson(jsonDecode(json) as Map<String, dynamic>);
    } else {
      throw Exception('URL is invalid or not supported. Please try again.');
    }
  }
}
