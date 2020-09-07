import 'package:audiobooks_flutter/service/book_parser_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  Dio client = Dio();
  String target = 'https://akniga.org/saymak-klifford-sdelay-sam-1';

  TestWidgetsFlutterBinding.ensureInitialized();

  test('remote responses', () async {
    final response = await client.get<dynamic>(target);
    expect(response.statusCode, equals(200));
  });
}
