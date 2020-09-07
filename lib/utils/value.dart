import 'package:moor/moor.dart';

extension ToValue<T> on T {
  Value<T> toValue() => Value(this);
}