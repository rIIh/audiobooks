List<T> insertBetween<T>(T object, Iterable<T> target) {
  var result = [...target];
  if (result.length > 1) {
    for (var i = result.length - 1; i > 0 ; i--) {
      result.insert(i, object);
    }
  }
  return result;
}

extension InsertBetweenList<T> on List<T> {
  List<T> spacedBy(T element) => insertBetween(element, this);
}

extension InsertBetweenIterable<T> on Iterable<T> {
  List<T> spacedBy(T element) => insertBetween(element, this);
}