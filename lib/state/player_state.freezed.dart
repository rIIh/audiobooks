// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies

part of 'player_state.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

class _$PlayerStateTearOff {
  const _$PlayerStateTearOff();

// ignore: unused_element
  Stopped stopped() {
    return const Stopped();
  }

// ignore: unused_element
  Playing playing(Chapter record, Duration currentTime) {
    return Playing(
      record,
      currentTime,
    );
  }

// ignore: unused_element
  Paused paused(Chapter record, Duration currentTime) {
    return Paused(
      record,
      currentTime,
    );
  }
}

// ignore: unused_element
const $PlayerState = _$PlayerStateTearOff();

mixin _$PlayerState {
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result stopped(),
    @required Result playing(Chapter record, Duration currentTime),
    @required Result paused(Chapter record, Duration currentTime),
  });
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result stopped(),
    Result playing(Chapter record, Duration currentTime),
    Result paused(Chapter record, Duration currentTime),
    @required Result orElse(),
  });
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result stopped(Stopped value),
    @required Result playing(Playing value),
    @required Result paused(Paused value),
  });
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result stopped(Stopped value),
    Result playing(Playing value),
    Result paused(Paused value),
    @required Result orElse(),
  });
}

abstract class $PlayerStateCopyWith<$Res> {
  factory $PlayerStateCopyWith(
          PlayerState value, $Res Function(PlayerState) then) =
      _$PlayerStateCopyWithImpl<$Res>;
}

class _$PlayerStateCopyWithImpl<$Res> implements $PlayerStateCopyWith<$Res> {
  _$PlayerStateCopyWithImpl(this._value, this._then);

  final PlayerState _value;
  // ignore: unused_field
  final $Res Function(PlayerState) _then;
}

abstract class $StoppedCopyWith<$Res> {
  factory $StoppedCopyWith(Stopped value, $Res Function(Stopped) then) =
      _$StoppedCopyWithImpl<$Res>;
}

class _$StoppedCopyWithImpl<$Res> extends _$PlayerStateCopyWithImpl<$Res>
    implements $StoppedCopyWith<$Res> {
  _$StoppedCopyWithImpl(Stopped _value, $Res Function(Stopped) _then)
      : super(_value, (v) => _then(v as Stopped));

  @override
  Stopped get _value => super._value as Stopped;
}

class _$Stopped implements Stopped {
  const _$Stopped();

  @override
  String toString() {
    return 'PlayerState.stopped()';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) || (other is Stopped);
  }

  @override
  int get hashCode => runtimeType.hashCode;

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result stopped(),
    @required Result playing(Chapter record, Duration currentTime),
    @required Result paused(Chapter record, Duration currentTime),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return stopped();
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result stopped(),
    Result playing(Chapter record, Duration currentTime),
    Result paused(Chapter record, Duration currentTime),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (stopped != null) {
      return stopped();
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result stopped(Stopped value),
    @required Result playing(Playing value),
    @required Result paused(Paused value),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return stopped(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result stopped(Stopped value),
    Result playing(Playing value),
    Result paused(Paused value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (stopped != null) {
      return stopped(this);
    }
    return orElse();
  }
}

abstract class Stopped implements PlayerState {
  const factory Stopped() = _$Stopped;
}

abstract class $PlayingCopyWith<$Res> {
  factory $PlayingCopyWith(Playing value, $Res Function(Playing) then) =
      _$PlayingCopyWithImpl<$Res>;
  $Res call({Chapter record, Duration currentTime});
}

class _$PlayingCopyWithImpl<$Res> extends _$PlayerStateCopyWithImpl<$Res>
    implements $PlayingCopyWith<$Res> {
  _$PlayingCopyWithImpl(Playing _value, $Res Function(Playing) _then)
      : super(_value, (v) => _then(v as Playing));

  @override
  Playing get _value => super._value as Playing;

  @override
  $Res call({
    Object record = freezed,
    Object currentTime = freezed,
  }) {
    return _then(Playing(
      record == freezed ? _value.record : record as Chapter,
      currentTime == freezed ? _value.currentTime : currentTime as Duration,
    ));
  }
}

@With(PlayingProgress)
class _$Playing with PlayingProgress implements Playing {
  const _$Playing(this.record, this.currentTime)
      : assert(record != null),
        assert(currentTime != null);

  @override
  final Chapter record;
  @override
  final Duration currentTime;

  @override
  String toString() {
    return 'PlayerState.playing(record: $record, currentTime: $currentTime)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is Playing &&
            (identical(other.record, record) ||
                const DeepCollectionEquality().equals(other.record, record)) &&
            (identical(other.currentTime, currentTime) ||
                const DeepCollectionEquality()
                    .equals(other.currentTime, currentTime)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^
      const DeepCollectionEquality().hash(record) ^
      const DeepCollectionEquality().hash(currentTime);

  @override
  $PlayingCopyWith<Playing> get copyWith =>
      _$PlayingCopyWithImpl<Playing>(this, _$identity);

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result stopped(),
    @required Result playing(Chapter record, Duration currentTime),
    @required Result paused(Chapter record, Duration currentTime),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return playing(record, currentTime);
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result stopped(),
    Result playing(Chapter record, Duration currentTime),
    Result paused(Chapter record, Duration currentTime),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (playing != null) {
      return playing(record, currentTime);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result stopped(Stopped value),
    @required Result playing(Playing value),
    @required Result paused(Paused value),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return playing(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result stopped(Stopped value),
    Result playing(Playing value),
    Result paused(Paused value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (playing != null) {
      return playing(this);
    }
    return orElse();
  }
}

abstract class Playing implements PlayerState, PlayingProgress {
  const factory Playing(Chapter record, Duration currentTime) = _$Playing;

  Chapter get record;
  Duration get currentTime;
  $PlayingCopyWith<Playing> get copyWith;
}

abstract class $PausedCopyWith<$Res> {
  factory $PausedCopyWith(Paused value, $Res Function(Paused) then) =
      _$PausedCopyWithImpl<$Res>;
  $Res call({Chapter record, Duration currentTime});
}

class _$PausedCopyWithImpl<$Res> extends _$PlayerStateCopyWithImpl<$Res>
    implements $PausedCopyWith<$Res> {
  _$PausedCopyWithImpl(Paused _value, $Res Function(Paused) _then)
      : super(_value, (v) => _then(v as Paused));

  @override
  Paused get _value => super._value as Paused;

  @override
  $Res call({
    Object record = freezed,
    Object currentTime = freezed,
  }) {
    return _then(Paused(
      record == freezed ? _value.record : record as Chapter,
      currentTime == freezed ? _value.currentTime : currentTime as Duration,
    ));
  }
}

@With(PlayingProgress)
class _$Paused with PlayingProgress implements Paused {
  const _$Paused(this.record, this.currentTime)
      : assert(record != null),
        assert(currentTime != null);

  @override
  final Chapter record;
  @override
  final Duration currentTime;

  @override
  String toString() {
    return 'PlayerState.paused(record: $record, currentTime: $currentTime)';
  }

  @override
  bool operator ==(dynamic other) {
    return identical(this, other) ||
        (other is Paused &&
            (identical(other.record, record) ||
                const DeepCollectionEquality().equals(other.record, record)) &&
            (identical(other.currentTime, currentTime) ||
                const DeepCollectionEquality()
                    .equals(other.currentTime, currentTime)));
  }

  @override
  int get hashCode =>
      runtimeType.hashCode ^
      const DeepCollectionEquality().hash(record) ^
      const DeepCollectionEquality().hash(currentTime);

  @override
  $PausedCopyWith<Paused> get copyWith =>
      _$PausedCopyWithImpl<Paused>(this, _$identity);

  @override
  @optionalTypeArgs
  Result when<Result extends Object>({
    @required Result stopped(),
    @required Result playing(Chapter record, Duration currentTime),
    @required Result paused(Chapter record, Duration currentTime),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return paused(record, currentTime);
  }

  @override
  @optionalTypeArgs
  Result maybeWhen<Result extends Object>({
    Result stopped(),
    Result playing(Chapter record, Duration currentTime),
    Result paused(Chapter record, Duration currentTime),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (paused != null) {
      return paused(record, currentTime);
    }
    return orElse();
  }

  @override
  @optionalTypeArgs
  Result map<Result extends Object>({
    @required Result stopped(Stopped value),
    @required Result playing(Playing value),
    @required Result paused(Paused value),
  }) {
    assert(stopped != null);
    assert(playing != null);
    assert(paused != null);
    return paused(this);
  }

  @override
  @optionalTypeArgs
  Result maybeMap<Result extends Object>({
    Result stopped(Stopped value),
    Result playing(Playing value),
    Result paused(Paused value),
    @required Result orElse(),
  }) {
    assert(orElse != null);
    if (paused != null) {
      return paused(this);
    }
    return orElse();
  }
}

abstract class Paused implements PlayerState, PlayingProgress {
  const factory Paused(Chapter record, Duration currentTime) = _$Paused;

  Chapter get record;
  Duration get currentTime;
  $PausedCopyWith<Paused> get copyWith;
}
