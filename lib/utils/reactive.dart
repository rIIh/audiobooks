import 'package:rxdart/subjects.dart';

import 'future_queue.dart';

class ReadOnlyReactive<T> {
  final BehaviorSubject<T> _subject;

  ReadOnlyReactive([T initialValue]) : _subject = initialValue == null ? BehaviorSubject() : BehaviorSubject.seeded(initialValue);

  T get value => _subject.value;

  Stream<T> watch() => _subject;
}

class Reactive<T> extends ReadOnlyReactive<T> {
  final FutureQueue<T> _queue = FutureQueue();

  Reactive([T initialValue]) : super(initialValue);

  void set(T value) => _subject.add(value);

  Future<T> appendStream(Stream<T> stream) => _queue.enqueue(() => _subject.addStream(stream));

  void setError(Object error) => _subject.addError(error);
}
