import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

import 'BookRow.dart';
import 'BookCard.dart';
import 'MiniPlayer.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
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

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key}) : super(key: key);

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('AudioBooks'),
      ),
      body: Container(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.max,
          children: <Widget>[
            Expanded(child: ListView(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  child: Text('Recent'),
                ),
                ConstrainedBox(
                  constraints: BoxConstraints(maxHeight: 146),
                  child: ListView.builder(
                    scrollDirection: Axis.horizontal,
                    padding: EdgeInsets.symmetric(horizontal: 14),
                    itemBuilder: (context, index) => BookCard(
                      height: 126,
                    ),
                  ),
                ),
                Padding(
                    padding: EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    child: Column(
                      children: List.generate(100, (index) => Center(
                        child: Padding(
                          padding: EdgeInsets.symmetric(vertical: 10),
                          child: BookRow(
                            active: Random().nextBool(),
                          ),
                        ),
                      ),),
                    )
                  /*ListView.builder(
                itemBuilder: (context, index) => Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 10),
                    child: BookRow(
                      active: Random().nextBool(),
                    ),
                  ),
                ),
                ),*/
                ),
              ],
            ),),
            MiniPlayer()
          ],
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: Icon(
                Icons.home,
                size: 24,
              ),
              title: Text('')),
          BottomNavigationBarItem(icon: Icon(Icons.layers), title: Text('')),
          BottomNavigationBarItem(icon: Icon(Icons.code), title: Text('')),
        ],
        showSelectedLabels: false,
        showUnselectedLabels: false,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}
