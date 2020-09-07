import 'package:koin/src/scope/scope_instance_extension.dart';

import 'book_parser_service.dart';

class LoadingStrategyResolver {
  List<LoadingStrategy> _strategies;

  LoadingStrategyResolver() {
    _strategies = getOrCreateScope().getAll<LoadingStrategy>();
  }

  LoadingStrategy resolve(String url) => _strategies.firstWhere(
        (element) => url.contains(element.target),
        orElse: () => null,
      );
}
