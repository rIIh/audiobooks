import 'package:audiobooks_flutter/modules/index.dart';
import 'package:audiobooks_flutter/widgets/pages/home_page.dart';
import 'package:flutter/material.dart';
import 'package:koin/koin.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatefulWidget {
  @override
  _MyAppState createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();
    startKoin((app) {
      app.printLogger(level: Level.debug);
      app.modules([
        mainModule,
        strategies,
      ]);
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.grey,
        appBarTheme: AppBarTheme(color: Colors.white, elevation: 1),
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      debugShowCheckedModeBanner: false,
      home: MyHomePage(),
    );
  }
}
