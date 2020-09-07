// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies

part of 'create_book_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

class _$CreateBookStateTearOff {
  const _$CreateBookStateTearOff();

// ignore: unused_element
  _Waiting waiting() {
    return const _Waiting();
  }

// ignore: unused_element
  _HasInput hasInput(String input) {
    return _HasInput(
      input,
    );
  }

// ignore: unused_element
  _Loading loading() {
    return const _Loading();
  }

// ignore: unused_element
  _Loaded loaded(BooksCompanion bookCandidate) {
    return _Loaded(
      bookCandidate,
    );
  }

// ignore: unused_element
  _Created created() {
    return const _Created();
  }
}

// ignore: unused_element
const $CreateBookState = _$CreateBookStateTearOff();

mixin _$CreateBookState {
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  });
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  });
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  });
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  });
}

abstract class $CreateBookStateCopyWith<$Res> {
  factory $CreateBookStateCopyWith(
          CreateBookState value, $Res Function(CreateBookState) then) =
      _$CreateBookStateCopyWithImpl<$Res>;
}

class _$CreateBookStateCopyWithImpl<$Res>
    implements $CreateBookStateCopyWith<$Res> {
  _$CreateBookStateCopyWithImpl(this._value, this._then);

  final CreateBookState _value;
  // ignore: unused_field
  final $Res Function(CreateBookState) _then;
}

abstract class _$WaitingCopyWith<$Res> {
  factory _$WaitingCopyWith(_Waiting value, $Res Function(_Waiting) then) =
      __$WaitingCopyWithImpl<$Res>;
}

class __$WaitingCopyWithImpl<$Res> extends _$CreateBookStateCopyWithImpl<$Res>
    implements _$WaitingCopyWith<$Res> {
  __$WaitingCopyWithImpl(_Waiting _value, $Res Function(_Waiting) _then)
      : super(_value, (v) => _then(v as _Waiting));

  @override
  _Waiting get _value => super._value as _Waiting;
}

class _$_Waiting implements _Waiting {
  const _$_Waiting();

  @override
  String toString() {
    return 'CreateBookState.waiting()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) || (other is _Waiting);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return waiting();
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (waiting != null) {
      return waiting();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return waiting(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (waiting != null) {
      return waiting(this);
    }
    return orElse();
  }
}

abstract class _Waiting implements CreateBookState {
  const factory _Waiting() = _$_Waiting;
}

abstract class _$HasInputCopyWith<$Res> {
  factory _$HasInputCopyWith(_HasInput value, $Res Function(_HasInput) then) =
      __$HasInputCopyWithImpl<$Res>;
  $Res call({String input});
}

class __$HasInputCopyWithImpl<$Res> extends _$CreateBookStateCopyWithImpl<$Res>
    implements _$HasInputCopyWith<$Res> {
  __$HasInputCopyWithImpl(_HasInput _value, $Res Function(_HasInput) _then)
      : super(_value, (v) => _then(v as _HasInput));

  @override
  _HasInput get _value => super._value as _HasInput;

  @override
  $Res call({
    Object input = freezed,
  }) {
    return _then(_HasInput(
      input == freezed ? _value.input : input as String,
    ));
  }
}

class _$_HasInput implements _HasInput {
  const _$_HasInput(this.input) : assert(input != null);

  @override
  final String input;

  @override
  String toString() {
    return 'CreateBookState.hasInput(input: $input)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is _HasInput &&
            (identical(other.input, input) ||
                const DeepCollectionEquality().equals(other.input, input)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^ const DeepCollectionEquality().hash(input);

  @override
  _$HasInputCopyWith<_HasInput> get copyWith =>
      __$HasInputCopyWithImpl<_HasInput>(this, _$identity);

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return hasInput(input);
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (hasInput != null) {
      return hasInput(input);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return hasInput(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (hasInput != null) {
      return hasInput(this);
    }
    return orElse();
  }
}

abstract class _HasInput implements CreateBookState {
  const factory _HasInput(String input) = _$_HasInput;

  String get input;
  _$HasInputCopyWith<_HasInput> get copyWith;
}

abstract class _$LoadingCopyWith<$Res> {
  factory _$LoadingCopyWith(_Loading value, $Res Function(_Loading) then) =
      __$LoadingCopyWithImpl<$Res>;
}

class __$LoadingCopyWithImpl<$Res> extends _$CreateBookStateCopyWithImpl<$Res>
    implements _$LoadingCopyWith<$Res> {
  __$LoadingCopyWithImpl(_Loading _value, $Res Function(_Loading) _then)
      : super(_value, (v) => _then(v as _Loading));

  @override
  _Loading get _value => super._value as _Loading;
}

class _$_Loading implements _Loading {
  const _$_Loading();

  @override
  String toString() {
    return 'CreateBookState.loading()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) || (other is _Loading);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return loading();
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (loading != null) {
      return loading();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return loading(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (loading != null) {
      return loading(this);
    }
    return orElse();
  }
}

abstract class _Loading implements CreateBookState {
  const factory _Loading() = _$_Loading;
}

abstract class _$LoadedCopyWith<$Res> {
  factory _$LoadedCopyWith(_Loaded value, $Res Function(_Loaded) then) =
      __$LoadedCopyWithImpl<$Res>;
  $Res call({BooksCompanion bookCandidate});
}

class __$LoadedCopyWithImpl<$Res> extends _$CreateBookStateCopyWithImpl<$Res>
    implements _$LoadedCopyWith<$Res> {
  __$LoadedCopyWithImpl(_Loaded _value, $Res Function(_Loaded) _then)
      : super(_value, (v) => _then(v as _Loaded));

  @override
  _Loaded get _value => super._value as _Loaded;

  @override
  $Res call({
    Object bookCandidate = freezed,
  }) {
    return _then(_Loaded(
      bookCandidate == freezed
          ? _value.bookCandidate
          : bookCandidate as BooksCompanion,
    ));
  }
}

class _$_Loaded implements _Loaded {
  const _$_Loaded(this.bookCandidate) : assert(bookCandidate != null);

  @override
  final BooksCompanion bookCandidate;

  @override
  String toString() {
    return 'CreateBookState.loaded(bookCandidate: $bookCandidate)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is _Loaded &&
            (identical(other.bookCandidate, bookCandidate) ||
                const DeepCollectionEquality()
                    .equals(other.bookCandidate, bookCandidate)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^ const DeepCollectionEquality().hash(bookCandidate);

  @override
  _$LoadedCopyWith<_Loaded> get copyWith =>
      __$LoadedCopyWithImpl<_Loaded>(this, _$identity);

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return loaded(bookCandidate);
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (loaded != null) {
      return loaded(bookCandidate);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return loaded(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (loaded != null) {
      return loaded(this);
    }
    return orElse();
  }
}

abstract class _Loaded implements CreateBookState {
  const factory _Loaded(BooksCompanion bookCandidate) = _$_Loaded;

  BooksCompanion get bookCandidate;
  _$LoadedCopyWith<_Loaded> get copyWith;
}

abstract class _$CreatedCopyWith<$Res> {
  factory _$CreatedCopyWith(_Created value, $Res Function(_Created) then) =
      __$CreatedCopyWithImpl<$Res>;
}

class __$CreatedCopyWithImpl<$Res> extends _$CreateBookStateCopyWithImpl<$Res>
    implements _$CreatedCopyWith<$Res> {
  __$CreatedCopyWithImpl(_Created _value, $Res Function(_Created) _then)
      : super(_value, (v) => _then(v as _Created));

  @override
  _Created get _value => super._value as _Created;
}

class _$_Created implements _Created {
  const _$_Created();

  @override
  String toString() {
    return 'CreateBookState.created()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) || (other is _Created);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result waiting(),
    @required Result hasInput(String input),
    @required Result loading(),
    @required Result loaded(BooksCompanion bookCandidate),
    @required Result created(),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return created();
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result waiting(),
    Result hasInput(String input),
    Result loading(),
    Result loaded(BooksCompanion bookCandidate),
    Result created(),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (created != null) {
      return created();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result waiting(_Waiting value),
    @required Result hasInput(_HasInput value),
    @required Result loading(_Loading value),
    @required Result loaded(_Loaded value),
    @required Result created(_Created value),
  }) {
    assert(waiting != null);
    assert(hasInput != null);
    assert(loading != null);
    assert(loaded != null);
    assert(created != null);
    return created(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result waiting(_Waiting value),
    Result hasInput(_HasInput value),
    Result loading(_Loading value),
    Result loaded(_Loaded value),
    Result created(_Created value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (created != null) {
      return created(this);
    }
    return orElse();
  }
}

abstract class _Created implements CreateBookState {
  const factory _Created() = _$_Created;
}
