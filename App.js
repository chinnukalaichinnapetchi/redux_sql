/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,

  Text,
  View,
  FlatList,
  Image,
  Dimensions
} from 'react-native';
import axios from 'axios';
import moment from 'moment/moment';
import { weatherdetail } from './Redux/Action';
import { connect } from 'react-redux';
import SQLite from 'react-native-sqlite-2'



const data = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }]
const App = (props) => {
  const [weatherData, setWeatherData] = useState([])

  const db = SQLite.openDatabase('test.db', '1.0', '', 1)
  useEffect(() => {

    new Promise((resolve, reject) => {
      db.transaction(tx => {

        tx.executeSql('SELECT * FROM `Weather`', [], function (tx, res) {
          console.log("Db data");
          reduxstore();

        }, (_, err) => {
          console.log("Apidata");
          Apicall();
        });
      });
    });


  }, [])
  const reduxstore = () => {

    db.transaction(function (txn) {


      txn.executeSql('SELECT * FROM `Weather`', [], function (tx, res) {
        for (let i = 0; i < res.rows.length; ++i) {
          props.weatherdetail(res.rows._array)


        }
      })

    })


  }
  const Apicall = async (dispatch) => {

    axios.get('https://api.openweathermap.org/data/2.5/forecast?q=M%C3%BCnchen,DE&appid=92d7b81b099d57154bd55d9472884403')
      .then(async (res) => {
        // console.log("res", res.data.list);

        var result = Object.values(res.data.list.reduce((a, c) => {
          a[moment(c.dt_txt).format('DD:MM:YYYY')] = Object.assign(a[moment(c.dt_txt).format('DD:MM:YYYY')] || {}, c);
          return a;
        }, {}));
        var filterdata = result.filter((item) => moment(item.dt_txt).format('MM') != '07')
        setWeatherData(filterdata)

        db.transaction(function (txn) {
          txn.executeSql('DROP TABLE IF EXISTS Weather', [])
          txn.executeSql(
            'CREATE TABLE IF NOT EXISTS Weather(id INTEGER PRIMARY KEY NOT NULL, date VARCHAR(30), temp VARCHAR(25),icon VARCHAR(25))',
            []
          )
          for (var i = 0; i < filterdata.length; i++) {
            const array = filterdata[i];

            txn.executeSql('INSERT INTO Weather (date, temp,icon) VALUES (?,?,?)',
              [array.dt_txt, array.main.temp, array.weather[0].icon])
            txn.executeSql('SELECT * FROM `Weather`', [], function (tx, res) {
              for (let i = 0; i < res.rows.length; ++i) {
                props.weatherdetail(res.rows._array)
                break;

                // console.log('item:1', res.rows._array)
              }
            })
          }
        })

      })
      .catch(() => {

      })



  }



  return (
    <SafeAreaView >
      <View >
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginHorizontal: 10, marginVertical: 10 }}>

          <Text style={{ justifyContent: 'flex-end', color: 'green', fontSize: 20, fontWeight: 'bold' }}>June</Text>
        </View>
        <FlatList data={props?.weather?.weather != undefined && props?.weather?.weather != []
          && props?.weather?.weather != '' ? props?.weather?.weather : weatherData}
          renderItem={({ item, index }) => {
            return (
              <View style={{ flex: 1 / 3, }}>
                <View style={{ flex: 0.5 }}></View>
                <View style={{
                  flexDirection: 'column', margin: 1,
                  borderColor: 'black', backgroundColor: '#aaaaaa', borderEndWidth: 1, borderRadius: 2,
                }}>
                  <Text style={{ fontSize: 20, padding: 10, alignSelf: 'flex-end', fontWeight: 'bold', flexDirection: 'row', justifyContent: 'flex-end' }}>{item.temp}°</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, padding: 10, alignSelf: 'flex-start', fontWeight: 'bold', flexDirection: 'row', }}>{moment(item.dt_txt).format('DD')}</Text>
                    <Image style={{ width: "30%", height: "80%" }} source={{ uri: `https://openweathermap.org/img/wn/${item.icon}.png` }}></Image>

                  </View>

                </View>
              </View>
            )

          }}
          numColumns={3}
          keyExtractor={(item, index) => index}
        >

        </FlatList>

      </View>

    </SafeAreaView>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    weatherdetail: data => {
      dispatch(weatherdetail(data));
    }
  }
}
const mapStateToProps = (state) => {

  return {
    weather: state.weather,

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
