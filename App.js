import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, useWindowDimensions, View, ImageBackground, TouchableWithoutFeedback, TextInput, FlatList, TouchableOpacity, ScrollView, Button, Keyboard, RefreshControl, Pressable, useColorScheme, TouchableHighlight, Switch, Animated, Easing, NativeModules} from 'react-native';
import { useState, useCallback, useEffect, useContext, createContext, useRef } from 'react';
//import {RenderHTML, defaultHTMLElementModels, HTMLContentModel} from 'react-native-render-html';
import { NavigationContainer, DarkTheme, DefaultTheme, useFocusEffect } from '@react-navigation/native'; import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import backgroundImage from "./assets/repeatingimagerestransparent.png"; import steamInspiredPlaceholderImg from "./assets/steamlikePlaceholderImg.png"
import { LinearGradient } from "expo-linear-gradient"
import MaskedView from '@react-native-masked-view/masked-view';


// import BackgroundAnimation from "./animatedbackground.js"

import { useFonts } from 'expo-font';

// GOOGLE
// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app"
import {getDatabase, ref, child, get,goOffline, goOnline} from "firebase/database"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "APIKEY",
  authDomain: "AUTHDOMAIN",
  projectId: "PROJECTID",
  storageBucket: "STORAGEBUCKET",
  messagingSenderId: "MESSAGINGSENDERID",
  appId: "APPID",
  measurementId: "MEASUREMENTID"
};
const firebaseApp = initializeApp(firebaseConfig);

// clearAll = async () => {
//   try {
//     await AsyncStorage.clear()
//     console.log("Cleared")
//   } catch (e) {
//     console.log(e)
//   }
// }
// clearAll();
// Initialize Firebase

// GOOGLE

function BackgroundAnimation() {
  const initialVal = 0;
  const INPUT_RANGE_START = 0;
  const INPUT_RANGE_END = 1;
  const OUTPUT_RANGE_START = -281; // pasted animation values from online web tutorial
  const OUTPUT_RANGE_END = 0;
  const ANIMATION_TO_VALUE = 1;
  const ANIMATION_DURATION = 25000;
  const translateVal = useRef(new Animated.Value(initialVal)).current;

  useEffect(() => {
    const translate = () => {
      translateVal.setValue(initialVal);
      Animated.timing(translateVal, {
        toValue: ANIMATION_TO_VALUE,
        duration: ANIMATION_DURATION,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => translate());
    };

    translate();
  }, [translateVal]);

  const translateInterpolate = translateVal.interpolate({
    inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
    outputRange: [OUTPUT_RANGE_START, OUTPUT_RANGE_END],
  });
  const translateXInterpolate = translateVal.interpolate({
    inputRange: [INPUT_RANGE_START, INPUT_RANGE_END],
    outputRange: [OUTPUT_RANGE_END, OUTPUT_RANGE_START]
  })
  const AnimatedImage = Animated.createAnimatedComponent(ImageBackground);

  return (

        <AnimatedImage 
            resizeMode="repeat" 
            style={[styles.background,{
                transform: [
                    {
                      translateX: translateXInterpolate,
                    },
                    {
                      translateY: translateInterpolate,
                    },
                  ],
            }]}
            source={backgroundImage} />

  )
}
// function CreditsView({textStyling, viewStyling, textValue}) {
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   useEffect(() => {
//     fadeAnim.setValue(0)
//     const fadeIn = () => {
//     // Will change fadeAnim value to 1 in 5 seconds
//     Animated.timing(fadeAnim, {
//       toValue: 1,
//       duration: 1000,
//       useNativeDriver: true,
//     }).start();
//     };
//     fadeIn()
//   }, [fadeAnim])
  
//   const FadeCreditsView = Animated.createAnimatedComponent(View)
//   return (
//     <FadeCreditsView style={{opacity: fadeAnim, ...viewStyling}}>
//       <Text style={textStyling}>{textValue}</Text>
//     </FadeCreditsView>
//   )
// }

//const testValue = {name: "RyomaMap", items: [{"id":"0","connected":"1","name":"","coordinates":[647,296]},{"id":"1","connected":"2","name":"","coordinates":[807,296]},{"id":"2","connected":"","name":"","coordinates":[738,417]}], url: 'https://assets.reedpopcdn.com/ryoma-ishin.jpg/BROK/thumbnail/1600x900/quality/100/ryoma-ishin.jpg', imgDimensions: [1600, 900]}
const testValue = {"name": "RyomaMap","items": [{"id":"0","connected":"1","name":"","coordinates":[647,296]},{"id":"1","connected":"2","name":"","coordinates":[807,296]},{"id":"2","connected":"","name":"","coordinates":[738,417]}], "url": 'https://assets.reedpopcdn.com/ryoma-ishin.jpg/BROK/thumbnail/1600x900/quality/100/ryoma-ishin.jpg', "imgDimensions": [1600, 900]};
const image = {uri: 'https://assets.reedpopcdn.com/ryoma-ishin.jpg/BROK/thumbnail/1600x900/quality/100/ryoma-ishin.jpg'};
const threeColors = [{id: 0, color: "blue"}, {id: 1, color: "red"}, {id: 2, color: "green"}]

let showNewTab = false;

const DarkThemeContext = createContext({
  isDark: true,
  changeDark: () => {}
})

const storeData = async (key,value) => {
  try {
    await AsyncStorage.setItem(key, value)
    //console.log(key)
    //console.log(value)
    //console.log(`Stored: ${value}`)
  } catch (e) {
    // saving error
    console.log(e)
  }
}
AsyncStorage.getItem("mapsList").then((value) => {
  if (typeof JSON.parse(value) != "object") {storeData("mapsList", JSON.stringify({}))}
})
storeData("selectedMap", JSON.stringify(""))
storeData("mappedPath", JSON.stringify([]))
const callFirebase = (str1 = `test`) => {
  return new Promise((resolve, reject) => {
    
     const dbRef = getDatabase(firebaseApp)
     let returnval;
     goOnline(dbRef)
     get(child(ref(dbRef), str1)).then((snapshot) => {
    if (snapshot.exists()) {

      goOffline(dbRef)
      resolve(snapshot.val())
    } else {
      goOffline(dbRef)
      resolve("No data available");
    }
    
    goOffline(dbRef)
  }).catch((error) => {
    console.error(error);
  });
  
  })
  
  
}

const dataval = [
  {id: 0, name: "Heatwave"}, {id: 1, name: "S7"}, {id: 2, name: "Dheeraj"}, {id: 3, name: "Rocks"}, {id: 4, name: "WhatNo"}
]
const darkTabThemeColor = {headerStyle: {backgroundColor: "#2e2d2e"}, headerTintColor: "#ffffff"}
const lightTabThemeColor = {headerStyle: {backgroundColor: "#ffffff"}, headerTintColor: "#000000"}
function generateIdToName(obj1) {
  let arr1 = [];
  let objkeys = Object.keys(obj1)
  for (let i = 0; i<objkeys.length; i++) {
    arr1.push({id: i, name: objkeys[i]})
  }
  return arr1;
}
function generateItemsToName(obj1) {
  let arr1 = [];
  for (let i = 0; i<obj1.length; i++) {
    arr1.push({id: i, name: obj1[i]["name"]})
  }
  return arr1;
}
function drawLine(coords1, coords2, thickness, color) {
  let x1 = coords1[0]; let y1 = coords1[1]; let x2 = coords2[0]; let y2 = coords2[1];
  let length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
  let cx = ((x1 + x2) / 2) - (length / 2);
  let cy = ((y1 + y2) / 2) - (thickness / 2);
  let angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
  // let div3 = document.createElement("div")
  let htmlLine = "padding:0px; margin:0px; height:" + thickness + "px; background-color:" + color + "; line-height:1px; position:absolute; left:" + cx + "px; top:" + cy + "px; width:" + length + "px; transform:rotate(" + angle + "deg);";
    //
    // alert(htmlLine);
    // div3.style.cssText = htmlLine
    // document.body.appendChild(div3);
  return {height: thickness, backgroundColor: color, position: "absolute", left: cx, top: cy, transform: `rotate(${angle}deg)`, width: length, angle: angle, borderColor: "white", borderWidth: 1.5}
}
function drawConnectingLines(ids, startLocation, endLocation) {
	// const endLocation = parseInt(document.getElementById("editDestinationLocation").value)
  // const startLocation = parseInt(document.getElementById("editStartLocation").value)
  //console.log(ids)
  const visited = new Set();
  let answ = [];
  if (startLocation == endLocation) {return [startLocation, endLocation]}
  const queue = [[startLocation, []]]
  while (queue.length > 0) {
    const currval = queue.shift();
    const connected = ids[currval[0]]["connected"].trim().split(" ").map(elm => (parseInt(elm)))
    //console.log("connected")
    //console.log(connected)
    for (d of connected) {
      if (d == endLocation) {
        //console.log("FOUND IT!!")
        //console.log((currval[1].concat(d)))
        if (answ.length == 0 || (answ.length > 0  && answ.length > (currval[1].length + 1))) {answ = [startLocation].concat(currval[1].concat(d))}
        
      }
      if (!visited.has(d)) {
        visited.add(d);
        queue.push([d, currval[1].concat(d)])
      }
    }
  }
  if (answ.length == 0) {return [-1]}
  return answ
  // let queue = []
  // let visited = new Array(ids.length)
  // for (let i = 0; i<visited.length; i++) {visited[i] = false}
  // let definitivePath = []
  // queue.push([startLocation, []])
  // //console.log(queue)
  // while (queue.length > 0) {
  // 	let popped = queue.pop(0);
  //   let loc = popped[0];
  //   let path = popped[1];
  //   console.log(popped)
  //   visited[loc] = true
  //   if (loc == endLocation) {
  //   	path.push(loc)
  //   	if (definitivePath.length > 0 && definitivePath[0].length > path.length) {
  //       definitivePath = [path]
  //     }
  //     continue
      
  //   }
    
  //   let locations = ids[loc]["connected"].split(" ")
  //   console.log("locations")
  //   console.log(locations)
  //   console.log(visited)
  //   path.push(loc)
  //   for (let i = 0; i < locations.length; i++) {
  //   	if (locations[i] != "" && visited[parseInt(locations[i])] == false) {
  //     	queue.push([parseInt(locations[i]), path])
  //     } 
    	
  //   }
    
  // }
  // return definitivePath[0]
}

function getDiff(word1, word2) {
  let dict1 = {};
  let dict2 = {};
  let diff = 0;
  for (let i = 0; i<word1.length; i++) {
  	if (!(word1[i] in dict1)) {
  	    dict1[word1[i]] = 0;
  	    dict2[word1[i]] = 0;
  	}
    dict1[word1[i]]++
    
  }
 	for (let j = 0; j<word2.length; j++) {
  	if (!(word2[j] in dict2)) {
  	    dict1[word2[j]] = 0;
  	    dict2[word2[j]] = 0;
  	}
    dict2[word2[j]]++
  }
  let iterdict = Object.keys(dict1);

  for (let c = 0; c<iterdict.length; c++) {
  	diff = diff + Math.abs(dict1[iterdict[c]] - dict2[iterdict[c]])
  }
  return diff;
}
function getAngleDiff(y, x) {
  // y is new angle, x is original
  return Math.atan2(Math.sin((y * Math.PI/180) - (x * Math.PI/180)), Math.cos((y * Math.PI/180) - (x * Math.PI/180))) * 180/Math.PI
}

function Autocomplete({datavalue, liststyle, inputstyle, inputplaceholder, storagekey, viewstyle, updatefunc, initval, placeholderColor}) {
  let datavl = datavalue;
  const setdatavl = new Set(datavl.map(({name}) => name))
  //console.log(setdatavl)
  const [dataList, changeDataList] = useState(datavalue)
  const [highlightText, toggleHighlightText] = useState({})
  const [showList, toggleShowList] = useState(false)
  const [textBoxValue, autocompleteValue] = useState(initval)
  
  return (
    <View style={viewstyle}>
      <TextInput autoCorrect={false} style={{...inputstyle, ...highlightText}} caretHidden={true} placeholder={inputplaceholder} placeholderTextColor={placeholderColor} onChangeText={() => {
        
      }}onFocus={() => {toggleShowList(true);}} onBlur={() => {}} value={textBoxValue} onKeyPress={(e) => {
        //console.log(textBoxValue)
        //console.log("key pressed:" + e.nativeEvent.key + "(" + String(e.nativeEvent.key.length) + ")")
        if (e.nativeEvent.key.length == 1) {
          
          autocompleteValue(textBoxValue + e.nativeEvent.key)
          
          updatefunc({txt: (textBoxValue + e.nativeEvent.key), isInSet: setdatavl.has(textBoxValue + e.nativeEvent.key)})
          if (setdatavl.has(textBoxValue + e.nativeEvent.key)) {toggleShowList(false);toggleHighlightText({borderColor: "green", borderBottomWidth: 4});Keyboard.dismiss();storeData(storagekey, (textBoxValue + e.nativeEvent.key))} else {toggleShowList(true);toggleHighlightText({borderColor: "red", borderBottomWidth: 4});storeData(storagekey, "")}
          
        }
        //console.log(e.nativeEvent.key)
        if (e.nativeEvent.key == "Backspace") {
          
          autocompleteValue(textBoxValue.substring(0, textBoxValue.length - 1))
          
          updatefunc({txt: textBoxValue.substring(0, textBoxValue.length -1), isInSet: setdatavl.has(textBoxValue.substring(0, textBoxValue.length -1))})
          if (setdatavl.has(textBoxValue.substring(0, textBoxValue.length - 1))) {toggleShowList(false);toggleHighlightText({borderColor: "green", borderBottomWidth: 4});storeData(storagekey, (textBoxValue + e.nativeEvent.key))} else {toggleShowList(true);toggleHighlightText({borderColor: "red", borderBottomWidth: 4});storeData(storagekey, "")}
          
          if (textBoxValue.trim().length == 0) {
            datavl = datavalue
          }
        } 
        
        
      }} onEndEditing={(e) => {console.log(Object.keys(e))}  } onSubmitEditing={(e) => {toggleShowList(false)}} />
      {showList == true ? <FlatList style={{height: 100, backgroundColor: placeholderColor == "black" ? "rgb(189, 189, 189)" : "rgb(75, 70, 75)"}} data={datavalue.sort((a, b) => getDiff(textBoxValue, a.name) - getDiff(textBoxValue, b.name))}  keyExtractor={item => item.id} renderItem={({item})=> <TouchableOpacity onPress={(e) => {toggleShowList(false); autocompleteValue(item.name); toggleHighlightText({borderColor: "green", borderBottomWidth: 4});storeData(storagekey, item.name); updatefunc({txt: item.name, isInSet: true})}}><View style={liststyle}><Text style={{color: liststyle.color}}>{item.name}</Text></View></TouchableOpacity>} /> : <Text style={{height:0}}></Text>}
    </View>
  );
}


function App() {
  return (
    <TabHolder />
  );
}
const TabCreate = createBottomTabNavigator();
const StackTabCreate = createNativeStackNavigator();
function TabHolder({navigation}) {
  const colorScheme = useColorScheme();
  const [isDark, changeDark] = useState(false)
  const darkValue = {isDark, changeDark}
  useEffect(() => {

      AsyncStorage.getItem("darkMode").then((value) => {
        if (value === undefined || value == null) {storeData("darkMode", JSON.stringify(true))}
        else if (JSON.stringify(isDark) != value) { changeDark(JSON.parse(value))}
      })
    
    
  }, [])
  return (
    <DarkThemeContext.Provider value={darkValue} >
    <NavigationContainer theme={{...DefaultTheme, colors: {...DefaultTheme.colors, primary: "rgb(58, 54, 77)", border: "rgb(58, 54, 77)"}}}>
      <StatusBar style={isDark == false ? "dark" : "light"} />
      <TabCreate.Navigator screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          const routeToName = {
            "Map": "map-marker-outline",
            "Preview": "map-outline",
            "Settings": "cog-outline" 
          }
          //console.log(routeToName[route.name].substring(0, routeToName[route.name].length - 8))
          return <Icon name={focused == false ? routeToName[route.name] : routeToName[route.name].substring(0, routeToName[route.name].length - 8) } size={size} color={color} />
        },
        tabBarActiveTintColor: "#2598F3",
        tabBarInactiveTintColor: "#CDCDCD",
        tabBarShowLabel: false, 
        tabBarStyle: {backgroundColor: isDark == false ? lightTabThemeColor.headerStyle.backgroundColor : darkTabThemeColor.headerStyle.backgroundColor}
      })}>
        <TabCreate.Screen name="Map" options={isDark == false ? lightTabThemeColor : darkTabThemeColor} component={MapPageTabHolder} />
        
        <TabCreate.Screen name="Preview" options={ isDark == false ? lightTabThemeColor : darkTabThemeColor} component={FullMapPreview} />
        <TabCreate.Screen name="Settings" options={isDark == false ? lightTabThemeColor : darkTabThemeColor}component={SettingsTabHolder} />
      </TabCreate.Navigator>
    </NavigationContainer></DarkThemeContext.Provider>
  )
}
function MapPageTabHolder({navigation}) {
  
  return <StackTabCreate.Navigator screenOptions={{headerShown: false}}>
    <StackTabCreate.Screen name="Map Select" component={MapPage} />
    <StackTabCreate.Screen name="Directions" component={Directions} />
    </StackTabCreate.Navigator>
}
function SettingsTabHolder({navigation}) {
  
  return <StackTabCreate.Navigator screenOptions={{headerShown: false}}>
    <StackTabCreate.Screen name="Settings Page" component={SettingsPage} />
    <StackTabCreate.Screen name="Remove Maps" component={RemoveMapsPage} />
  </StackTabCreate.Navigator>
}
function MapPage({ navigation }) {
  
  //OLD -- const placeholderBackground = "https://user-images.githubusercontent.com/7369575/141402665-d6428d3f-ac95-42b0-8506-2c19eb0ef290.png";
  
  // 

  const [MapsList, editMapsList] = useState({})
  const [imgBackgroundURL, editImgBackgroundURL] = useState(steamInspiredPlaceholderImg)
   
  const [textvalue1, updatefunc] = useState({txt: "", isInSet: false})
  const [startValue, editStartValue] = useState({txt: "", isInSet: false})
  const [destinationValue, editDestinationValue] = useState({txt: "", isInSet: false})
  const {isDark, changeDark} = useContext(DarkThemeContext)
  
  AsyncStorage.getItem("firstViewing").then((value) => {
    if (value === undefined || value == null) {storeData("firstViewing", JSON.stringify("true")); alert("First time? This is intended to be used with maps from the map builder at fyrot.github.io/remapp/")}
  }) 
  useEffect(() => {
    const getMapsVal = navigation.addListener("focus", () => {
      // alert("Focused")
      AsyncStorage.getItem("mapsList").then((value) => {
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(MapsList) != value) {editMapsList(JSON.parse(value));}
        //doRefresh(false)
      })
      

    })
    
    return getMapsVal
  }, [])

  if (MapsList[textvalue1.txt] !== undefined && textvalue1.isInSet && imgBackgroundURL != MapsList[textvalue1.txt]["url"]) { editImgBackgroundURL(MapsList[textvalue1.txt]["url"]);} //console.log(MapsList[textvalue1.txt]["url"]);
  //else if (!(textvalue1.isInSet) && imgBackgroundURL != steamInspiredPlaceholderImg) {editImgBackgroundURL(steamInspiredPlaceholderImg)}
  if (!(textvalue1.isInSet && startValue.isInSet && destinationValue.isInSet)) {
    // storeData("mappedPath", JSON.stringify([]))
    // console.log("wiped")
  } 
  //
  const renderHTMLwidth = useWindowDimensions().width;
  //console.log("width")
  //console.log(renderHTMLwidth)
  
  // const [grabFontsLoad] = useFonts({
  //   "Teko-Light": require("./assets/fonts/Teko-Light.ttf")
  // })
  // if (!(grabFontsLoad)) {return null}
  //const {renderHTMLheight} = useWindowDimensions().height
  return <View style={isDark == false ? {...styles.container, ...styles.whiteThemeColor} : {...styles.container, ...styles.darkThemeColor}}>
   
   <TouchableWithoutFeedback onPress={() => {navigation.navigate("Preview")}}> 
  <View style={styles.halfcontainer}>
    
    <ImageBackground source={textvalue1.isInSet && imgBackgroundURL != steamInspiredPlaceholderImg ? {uri: imgBackgroundURL} : steamInspiredPlaceholderImg} resizeMode="cover" style={{...styles.imageBack, borderColor: "rgb(20, 10, 20)", borderWidth: 5, borderBottomEndRadius: 8, borderBottomStartRadius: 8}} blurRadius={imgBackgroundURL == steamInspiredPlaceholderImg ? 0 : 5}>
    
    </ImageBackground>
    
    </View></TouchableWithoutFeedback>
    <View style={styles.halfcontainer}>
      
      
      <Autocomplete updatefunc={updatefunc}  initval="" datavalue={generateIdToName(MapsList)} inputplaceholder="Select Map"liststyle={{padding: 8, backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(55, 54, 55)", borderRadius: 10, marginTop: 8, marginHorizontal: 10, color: isDark == false ? "black" : "white"}} inputstyle={{backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(46, 45, 46)", color: isDark == false ? "black" : "white"}} placeholderColor={isDark == false ? "black" : "white"}storagekey="selectedMap" viewstyle={{margin: 10, marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 2}} />
      
      {textvalue1.isInSet && MapsList[textvalue1.txt] !== undefined ?  <View>
      <Autocomplete updatefunc={editStartValue} initval ="" datavalue={generateItemsToName(MapsList[textvalue1.txt]["items"])} inputplaceholder="Select Start"liststyle={{padding: 8, backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(55, 54, 55)", borderRadius: 10, marginTop: 8, marginHorizontal: 10, color: isDark == false ? "black" : "white"}} inputstyle={{backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(46, 45, 46)", color: isDark == false ? "black" : "white"}} placeholderColor={isDark == false ? "black" : "white"} storagekey="selectedStartLocation" viewstyle={{margin: 5, marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 2}} />
      <Autocomplete updatefunc={editDestinationValue} initval=""datavalue={generateItemsToName(MapsList[textvalue1.txt]["items"])} inputplaceholder="Select Destination"liststyle={{padding: 8, backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(55, 54, 55)", borderRadius: 10, marginTop: 8, marginHorizontal: 10, color: isDark == false ? "black" : "white"}} inputstyle={{backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(46, 45, 46)", color: isDark == false ? "black" : "white"}} placeholderColor={isDark == false ? "black" : "white"} storagekey="selectedStartLocation" viewstyle={{margin: 5, marginLeft: 10, marginRight: 10, borderRadius: 5, borderWidth: 2}} />
      </View> :
      <Text></Text>
      // <Text>{JSON.stringify(MapsList)}</Text>
      }
      {startValue.isInSet == true && destinationValue.isInSet == true ? <View style={{marginHorizontal: (renderHTMLwidth/2)-(140/2)}}><Pressable style={{width: "100%"}} onLongPress={() => { navigation.navigate("Directions");}} onPressIn={() => {
        
        //console.log("PRESSED LONG");
        let getStartAndEndInd = {}
        for (let i = 0; i<MapsList[textvalue1.txt]["items"].length; i++) {
            getStartAndEndInd[MapsList[textvalue1.txt]["items"][i]["name"]] = i
        }
        let result = drawConnectingLines(MapsList[textvalue1.txt]["items"], getStartAndEndInd[startValue.txt], getStartAndEndInd[destinationValue.txt])
        //console.log("__RESULT__")
        //console.log(result)
        if (result[0] === -1) {storeData("mappedPath", JSON.stringify([-getStartAndEndInd[startValue.txt], -getStartAndEndInd[destinationValue.txt]])); return;}
        storeData("mappedPath", JSON.stringify(result))
        let coordpairs = [];
        let pointer1 = result[0];
        for (let i = 1; i<result.length; i++) {coordpairs.push([pointer1, result[i]]); pointer1 = result[i]}
        //console.log(coordpairs)
        let directionsList = [];
        let facingAngle = 90; // North
        const turnIntervals = [[-180, -150, "around to the left"], [-150, -120, "an obtuse left"], [-120, -90, "a slightly more than sharp left"], [-90, -60, "left"],[-60, -30, "a wide left"], [-30, -15, "a slight left"], [-15, 15, "seemingly straight ahead"], [15, 30, "a slight right"], [30, 60, "a wide right"], [60, 90, "right"], [90, 120, "a slightly more than sharp right"], [120, 150, "an obtuse right"], [150, 181, "around to the right"]]
        const mapStringToIcon = {
          "around to the left": "arrow-u-down-left",
          "an obtuse left": "arrow-bottom-left",
          "a slightly more than sharp left": "arrow-left-bottom",
          "left": "arrow-left",
          "a wide left": "arrow-up-left",
          "a slight left": "arrow-top-left",
          "seemingly straight ahead": "arrow-up",
          "a slight right": "arrow-top-right",
          "a wide right": "arrow-up-right",
          "right": "arrow-right",
          "a slightly more than sharp right": "arrow-right-bottom",
          "an obtuse right": "arrow-bottom-right",
          "around to the right": "arrow-u-down-right"
        }
        for (let j = 0; j<coordpairs.length; j++) {
          let propertiesObj = drawLine(MapsList[textvalue1.txt]["items"][coordpairs[j][0]]["coordinates"], MapsList[textvalue1.txt]["items"][coordpairs[j][1]]["coordinates"], 1, "red")
          let dist = propertiesObj.width; let anglechange = propertiesObj.angle;
          let degreeChange = getAngleDiff(anglechange, facingAngle)
          let turnString = "";
          if (degreeChange == 0) {turnString = "straight ahead"} else {
            for (let a = 0; a < turnIntervals.length; a++) {
              if (turnIntervals[a][0] <= degreeChange && degreeChange < turnIntervals[a][1]) {turnString=turnIntervals[a][2]; break}
            }
          }

          directionsList.push({id: j, degreeTurn: degreeChange, turnAmount: turnString, additionalProps: propertiesObj, iconName: mapStringToIcon[turnString], destination: MapsList[textvalue1.txt]["items"][coordpairs[j][1]]["name"]})
          facingAngle = anglechange;
        }
        storeData("directionsList", JSON.stringify(directionsList))
        //console.log(directionsList)
      }} onPress={() => {navigation.navigate("Preview")}}
        
        
        
        >
          <View style={{backgroundColor: "rgb(27, 25, 25)", width: 140, height: 75, borderRadius: 5, marginTop: 25}}>
    <View style={{justifyContent: 'center', backgroundColor: "rgb(250, 250, 250)", width: 140, height: 50, borderRadius: 5,position: "relative"}}>
    <Text style={{textAlign: "center", color: "black", fontWeight: "bold"}} numberOfLines={1} adjustsFontSizeToFit={true}>
    Save Directions
    </Text>
    </View>
    <Text style={{textAlign: "center", color: "white", top: 2.5, fontWeight: "bold"}} numberOfLines={1} adjustsFontSizeToFit={true}> 
    Hold For List
    </Text>
  </View>
          </Pressable>
          {/* <Button title="Firebase" color="red" onPress={() => {
            // const dbRef = getDatabase(firebaseApp)
            // goOnline(dbRef)
            // get(child(ref(dbRef), `test`)).then((snapshot) => {
            //   if (snapshot.exists()) {
            //     console.log(snapshot.val());
            //   } else {
            //     console.log("No data available");
            //   }
            //   goOffline(dbRef)
            // }).catch((error) => {
            //   console.error(error);
            // });
            callFirebase().then((data) => {
              console.log(data)
            })
            
          }} /> */}
          </View>: <Text></Text>}
        
    </View>
    {/* <MaskedView style={{width: "100%", height: "100%"}} 
      maskElement={<LinearGradient style={{position: "absolute", top: 0}}colors={['rgba(0,0,0,0.8)', 'transparent']}/>}
    >  */}
    <MaskedView style={styles.background} maskElement={<LinearGradient style={{...styles.background, height: "50%", top: "25%"}} colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.1)","rgba(255, 0, 0, 0.2)","rgba(0, 0, 0, 0.5)","rgba(0, 0, 0, 1)"]} ></LinearGradient>}>
      <BackgroundAnimation />
      
    </MaskedView>
    
    <LinearGradient style={styles.background} colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.8)"]}/>
    {/* </MaskedView> */}
  </View>
} //
const FullMapPreview = ({ navigation }) => {
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;
  const placeholderBackground = "https://user-images.githubusercontent.com/7369575/141402665-d6428d3f-ac95-42b0-8506-2c19eb0ef290.png";
  const [MapsList, editMapsList] = useState({})
  const [imgBackgroundURL, editImgBackgroundURL] = useState(placeholderBackground)
  const [chosenMap, updateChosenMap] = useState("")
  const [mappedPath, updateMappedPath] = useState([])
  const [showLocation, updateShowLocation] = useState({show: false, stopno: -1, stopname: ""})
  
  useEffect(() => {
    const getMapsVal = navigation.addListener("focus", () => {
      // alert("Focused")
      AsyncStorage.getItem("mapsList").then((value) => {  
        //console.log("MAPS LIST" + value)
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(MapsList) != value) {editMapsList(JSON.parse(value))}
        //doRefresh(false)
      })
      AsyncStorage.getItem("selectedMap").then((value) => {
        if (value === undefined || value === null) {return;}
        else if (chosenMap != value) {updateChosenMap(value)} //console.log("chosenMap: " +value); 
        
      })
      AsyncStorage.getItem("mappedPath").then((value) => {
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(mappedPath) != value) {updateMappedPath(JSON.parse(value))}//console.log("mappedPath:" + value); 
      })
    })

    return getMapsVal
  }, [])
  if (Object.keys(MapsList).length == 0 || !(chosenMap in MapsList)) {return <View style={styles.container}><ImageBackground resizeMode='cover' style={{justifyContent: "center", ...styles.imageBack}} source={steamInspiredPlaceholderImg} blurRadius={12}><Text style={{backgroundColor: "rgba(0,0,0,0.5)", color: "white", fontStyle: "italic", fontSize: 65, textAlign: "center", borderRadius: 15, marginHorizontal: 20, padding: 5}} adjustsFontSizeToFit={true}>Choose a map!</Text></ImageBackground></View>}
  
  let sizeImg; let scaleFact; let aspectRat;
  let createdIdList = [];
  let possiblePath = true;
  let sumOfMappedPath = 0; mappedPath.forEach((num) => {sumOfMappedPath += num})
  if (sumOfMappedPath < 0) {possiblePath = false;}
  if (!possiblePath) {
    for (let i = 0; i < mappedPath.length; i++) {
      mappedPath[i] = -mappedPath[i]
    }
  }
  if (mappedPath.length > 1) {
    
    let pointer1 = mappedPath[0];
    for (let i = 1; i<mappedPath.length; i++) {
      createdIdList.push({id: i, coord1: pointer1, coord2: mappedPath[i]})
      pointer1 = mappedPath[i]
    }
    createdIdList.push({id: mappedPath.length, coord1: mappedPath[mappedPath.length-1], coord2: mappedPath[mappedPath.length - 1]})
    //console.log(createdIdList)
  } else if (mappedPath.length == 1) {
    createdIdList = [-1]
  }
  
  // console.log(createdIdList)
  // let sizeImg = [1600, 900];
  // let aspectRat = testValue.imgDimensions[0] / testValue.imgDimensions[1] 
  // let scaleFact = windowWidth / testValue.imgDimensions[1]
  
  let chosenMapList = []
  let elmCount = 0;
  if (chosenMap.length > 0) {
    sizeImg = MapsList[chosenMap]["imgDimensions"]
    scaleFact = sizeImg[0] > sizeImg[1] ? windowWidth / sizeImg[1] : windowWidth/sizeImg[0]
    aspectRat = sizeImg[0] / sizeImg[1]
    chosenMapList = MapsList[chosenMap]["items"]
  }
  //console.log(sizeImg)
  //console.log("chosenMap" + chosenMap) // 
  return <View style={styles.container}>
    
    { chosenMap.length > 0 ?
    <ImageBackground resizeMode="cover" style={styles.imageBack}source={{uri: MapsList[chosenMap]["url"]}} blurRadius={8}>
      
        <ImageBackground source={{uri: MapsList[chosenMap]["url"]}} style={sizeImg[0] > sizeImg[1] ? { width: (windowWidth * aspectRat), height: windowWidth, transform: `translate(-${0.5 * (windowWidth * aspectRat) }px, -${0.5 * windowWidth}px) rotate(90deg) translate(${windowWidth * (aspectRat) * 0.5}px, -${0.5 * windowWidth}px)`} : {width: windowWidth, height: windowWidth * (1/aspectRat), transform: `translate(0px, ${(windowHeight - (windowWidth * (1/aspectRat)))/2 - 75}px)`}}>
        {possiblePath == false ? <Text style={{textAlignVertical: "center", textAlign: "center", color: "red", backgroundColor: "rgba(255,255,255,0.5)", fontWeight: "600"}}>No Possible Routing, According To Map</Text> : <View></View>}
        {createdIdList.length > 0 && Object.keys(MapsList[chosenMap]).length > 0 ? createdIdList.map(elm => {
          let styleParameters = drawLine(chosenMapList[elm.coord1]["coordinates"], chosenMapList[elm.coord2]["coordinates"], 3, possiblePath ? "blue" : "red");
          //console.log(elm.coord1)
          //console.log(elm.coord2)
          
          //console.log(styleParameters)
          let firstCoords = chosenMapList[elm.coord1]["coordinates"]
          //console.log(firstCoords)
          let markerColor = "rgb(189, 189, 189)"
          elmCount++;
          if (elmCount == 1) {
            markerColor = "rgb(60, 199, 97)" 
          }
          if (elmCount == createdIdList.length) {
            markerColor = "rgb(199, 60, 60)"
          }
          return (
            <View key={elm.id}>
            <View style={{height: 20, width: 20, backgroundColor: markerColor, position: "absolute", top: (firstCoords[1] * scaleFact) - 10, left: (firstCoords[0] * scaleFact) - 10, borderRadius: 5, zIndex: 10, borderWidth: 5, borderColor: "black"}}></View>
            
            <View   style={
              {height: styleParameters.height * scaleFact,
              width: styleParameters.width * scaleFact,
              position: "absolute",
              top: styleParameters.top * scaleFact,
              left: styleParameters.left * scaleFact,
              backgroundColor: styleParameters.backgroundColor,
              transform: styleParameters.transform,
              borderColor: styleParameters.borderColor,
              borderWidth: possiblePath ? styleParameters.borderWidth : 0,
              zIndex: 5
              }
            }></View></View>
          )
        }) : <View></View> }
        
        </ImageBackground>
      {/* {showLocation.show == true ? <View style={{marginHorizontal: "2.5%", width: "95%", height: "80%"}}>
        <Text>Stop {showLocation.stopno}: {showLocation.stopname}</Text>
        <Button name="X" onPress={(e) => {updateShowLocation({show: false, stopno: -1, stopname: ""})}}/>
      </View> : <View></View>} */}
    </ImageBackground> : <Text></Text> }
  </View>
}

// Not In List.. 😳
//That location couldn't be navigated to. If this was unintentional, please contact the creator of this map and ask them to update it.
const SettingsPage = ({navigation}) => {
  
  
  const [asyncVal, changeAsync] = useState("")
  const [MapsList, editMapsList] = useState({})
  const [militaryTimeSwitch, toggleMilitaryTimeSwitch] = useState(false)
  const [darkMode, toggleDarkMode] = useState(false)
  

  let returnedval = "Waiting..";
  const {isDark, changeDark} = useContext(DarkThemeContext)

  //Credits Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const FadeCreditsView = Animated.createAnimatedComponent(View)
  
  const creditList = ["Credits to Material Community Icons for the icons", "Props to Proton for being very cool", "Made possible by React Native & Expo developers and doc maintainers", "Manifested by various web tutorials, Stack Overflow threads, and Medium articles", "I think the Earth is green.. or is it blue?", "Thanks Firebase", "Six without 's' is nine", "Hello there", "On the directions tab, the first turn is initially based off of if you were facing north", "When a computer overheats, it freezes"]
  const [selectedCredit, updateSelectedCredit] = useState("")
  // End of credits information
  
  useEffect(() => {
    const getMapsVal = navigation.addListener("focus", () => {
      // alert("Focused")
      AsyncStorage.getItem("mapsList").then((value) => {
        //console.log("SETTINGS PAGE" + value)
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(MapsList) != value) {editMapsList(JSON.parse(value))}

      })
      AsyncStorage.getItem("militaryTimeToggle").then((value) => {
        if (value === undefined || value == null) {storeData(JSON.stringify(false)); return}
        else if (JSON.stringify(militaryTimeSwitch) != value) {toggleMilitaryTimeSwitch(JSON.parse(value))}
      })
      AsyncStorage.getItem("darkMode").then((value) => {
        if (value === undefined || value == null) {storeData("darkMode", JSON.stringify(false))}
        else if (JSON.stringify(darkMode) != value) {toggleDarkMode(JSON.parse(value))}
      })
      
      let selectedCreditIndex = Math.floor(Math.random() * creditList.length)
      updateSelectedCredit(creditList[selectedCreditIndex])
      
      fadeAnim.setValue(0)
      const fadeIn = () => {
      // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
        };
        fadeIn()
        })
    return getMapsVal
  }, [])
  
  
  
  return <View style={darkMode == false ? {...styles.container, ...styles.whiteThemeColor} : {...styles.container, ...styles.darkThemeColor}}>
    <View style={{flex: 0.5}}>
    {/*<Button title='abc' onPress={()=> {storeData("abc", "def")}}/>*/}
    <TextInput placeholder='Add map by ID' style={{backgroundColor: "rgb(189, 189, 189)", minHeight: 10, borderRadius: 5, marginTop: 5, ...styles.horizontalmargin}} onSubmitEditing={(e) => {

      if (isNaN(parseInt(e.nativeEvent.text))) {
        alert("Not a valid key! (Must be a numerical value)")
        return;
      }
      // callFirebase(e.nativeEvent.text).then((data) => {
      //   if (data == "No data available") {

      //   }
      //   let addedObj = JSON.parse(data);
      //   let duplicateMapsList = MapsList;
      //   duplicateMapsList[addedObj.name] = addedObj;
      
      //   editMapsList(duplicateMapsList)
      //   storeData("mapsList", JSON.stringify(duplicateMapsList));
      // });
      const dbRef = getDatabase(firebaseApp)
     
      goOnline(dbRef)
      //console.log(isNaN(parseInt(e.nativeEvent.text)))
      //console.log(e.nativeEvent.text)
      get(child(ref(dbRef), e.nativeEvent.text)).then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          // console.log(Object.keys(snapshot.val()))
          let addedObj = JSON.parse(snapshot.val());
          //console.log(addedObj)
          //console.log("MapsList: " + JSON.stringify(MapsList))
          let duplicateMapsList = MapsList;
          //console.log(duplicateMapsList)
          duplicateMapsList[addedObj.name] = addedObj;
      
          
          storeData("mapsList", JSON.stringify(duplicateMapsList));editMapsList(duplicateMapsList);
          alert("Added/edited a map")
          
        } else {
          alert("Invalid map ID")
        }
    
        goOffline(dbRef)
      }).catch((error) => {
        console.error(error);
      });
      // let addedObj = JSON.parse(firebaseval);
      // let duplicateMapsList = MapsList;
      // duplicateMapsList[addedObj.name] = addedObj;
      
      // editMapsList(duplicateMapsList)
      // storeData("mapsList", JSON.stringify(duplicateMapsList));
      
    }} />
    <View style={{width: "100%", justifyContent: "center", alignItems: "center", paddingVertical: 10}}>
      <Text numberOfLines={1} style={darkMode ? styles.darkThemeColor : styles.whiteThemeColor}> - OR - </Text>
    </View>
    
    <TextInput placeholder='Add map here' style={{backgroundColor: "rgb(189, 189, 189)", minHeight: 10, borderRadius: 5, ...styles.horizontalmargin}} onSubmitEditing={(e) => {
      
      let addedObj = JSON.parse(e.nativeEvent.text);
      let duplicateMapsList = MapsList;
      duplicateMapsList[addedObj.name] = addedObj;
      
      editMapsList(duplicateMapsList)
      storeData("mapsList", JSON.stringify(duplicateMapsList));
      //console.log(MapsList)
      //console.log(duplicateMapsList)
      }}/>  
    {/* <Text>Raw Map List{JSON.stringify(MapsList)}</Text> */}
    
    <View style={{flexDirection: "row", ...styles.horizontalmargin, marginVertical: 5}}> 
      <View style={{justifyContent: "center", alignItems: "center"}}>
        <Text style={darkMode ? {fontSize: 17, ...styles.darkThemeColor, fontWeight: "bold"} : {fontSize: 17, ...styles.whiteThemeColor, fontWeight: "bold"}}>Military Time</Text>
      </View>
    <Switch value={militaryTimeSwitch} onValueChange={() => {toggleMilitaryTimeSwitch(!(militaryTimeSwitch)); storeData("militaryTimeToggle", JSON.stringify(!(militaryTimeSwitch)))}} />
    </View>
    <View style={{flexDirection: "row", ...styles.horizontalmargin, marginVertical: 5}}>
      <View style={{justifyContent: "center", alignItems: "center"}}>
        <Text style={darkMode ? {fontSize: 17, ...styles.darkThemeColor, fontWeight: "bold"} : {fontSize: 17, ...styles.whiteThemeColor, fontWeight: "bold"}}>Dark Mode</Text>
      </View>
    <Switch style={{alignSelf: "flex-end"}}value={darkMode} onValueChange={() => {changeDark(!darkMode); toggleDarkMode(!(darkMode)); storeData("darkMode", JSON.stringify(!(darkMode)))}} />
    </View>
    <TouchableOpacity onPress={() => {navigation.navigate("Remove Maps")}} style={{alignSelf: "center"}}><Text style={{backgroundColor: "red", color: "white", borderRadius: 5, textAlign: "center", padding: 10, ...styles.horizontalmargin}}>Remove From Maps</Text></TouchableOpacity>
    </View>
    <View style={{flex: 0.25}}></View>
    {/* <CreditsView textStyling={{color: "white", textAlign: "center"}} viewStyling={{justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 3, marginHorizontal: 20, borderRadius: 10}} textValue={"Credits to " + selectedCredit}/>  */}
    <FadeCreditsView style={{opacity: fadeAnim, justifyContent: "center", backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 5, marginHorizontal: 20, borderRadius: 10}}>
      <Text style={{color: "white", textAlign: "center", fontWeight: "900"}}>{selectedCredit}</Text>
    </FadeCreditsView>
    <LinearGradient style={styles.background} colors={["rgba(0,0,0,0)", "rgba(0,0,0,0)", "rgba(0,0,0,0.35)", "rgba(0,0,0,0.8)"]}/>
  </View>
}
const RemoveMapsPage = ({navigation}) => {
  const [MapsList, editMapsList] = useState({})
  const [genList, regenList] = useState([])
  const {isDark, changeDark} = useContext(DarkThemeContext)
  const [doRefresh, canRefresh] = useState(false)
  const windowWidth = useWindowDimensions().width;
  useEffect(() => {
    
    const getMapsVal = navigation.addListener("focus", () => {
      // alert("Focused")
      AsyncStorage.getItem("mapsList").then((value) => {
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(MapsList) != value) {editMapsList(JSON.parse(value)); regenList(generateIdToName(JSON.parse(value)))}

      })
      
    })
    return getMapsVal
  })
  AsyncStorage.getItem("mapsList").then((value) => {
    if (value === undefined || value == null) {return;}
    else if (JSON.stringify(MapsList) != value) {editMapsList(JSON.parse(value))}

  })

  //console.log(MapsList)
  return <View style={isDark == false ? {...styles.container, ...styles.whiteThemeColor} :{...styles.container, ...styles.darkThemeColor}}>
    <Text style={{color: isDark == false ? "#000000" : "#ffffff", fontWeight: "bold", fontSize: 18, textAlign: "center", marginTop: 10}}> Remove Select Maps </Text>
    <Text adjustsFontSizeToFit={true} numberOfLines={1} style={{color: isDark == false ? "#000000" : "#ffffff", fontWeight: "bold", textAlign: "center", marginTop: 10}}> (Changes will be put into effect after app restart, "just in case") </Text>
      <FlatList data={genList} renderItem={({item}) => 
      <View style={{backgroundColor: isDark == false ? "rgb(240, 240, 240)" : "rgb(55, 54, 55)", marginVertical: 10, marginHorizontal: 10, flexDirection: "row", flex: 1, borderRadius: 20, padding: 5}}>
        <View style={{flex: 0.8, justifyContent: "center", height: "100%"}}>
        <Text style={{textAlign: "center", color: isDark == false ? "#000000" : "#ffffff"}} numberOfLines={0}>{item.name}</Text>
        </View>
        <View style={{flex: 0.15}}>
        <Button title="X" style={{alignSelf: "stretch"}} color={"red"} onPress={() => {
          let updated = MapsList;
          delete updated[item.name];
          //storeData("mapsList", JSON.stringify(updated))
          
          storeData("mapsList", JSON.stringify(updated))
          AsyncStorage.getItem("selectedMap").then((value) => {
            if (value == item.name) {
              storeData("mappedPath", JSON.stringify([]))
              storeData("selectedMap", JSON.stringify(""))
            }
          })
          
          
          
          storeData("removedMap", JSON.stringify(true))
          editMapsList(updated)
          regenList(generateIdToName(updated))

        }} /></View>
        <View style={{flex: 0.05}}/>
      </View>}
      keyExtractor={item => item.id}/>
    
    <TouchableOpacity onPress={() => {navigation.goBack()}}>
      
      
      <View style={{height: 60, marginVertical: 10,borderRadius: 20, backgroundColor: "rgb(240, 30, 30)", marginHorizontal: 10}}><Icon size={50} style={{marginHorizontal: (windowWidth - 70)/2}}name="exit-run" color="#ffffff"/></View>
      
      </TouchableOpacity>
    
  </View>
}
function Directions({navigation}) {
  const [datavalue, updateDataValue] = useState([])
  const widthofWin = useWindowDimensions().width;
  const [militaryTimeSwitch, toggleMilitaryTimeSwitch] = useState(false)
  const {isDark, changeDark} = useContext(DarkThemeContext)

  
  useEffect(() => {
    const getDirectionsList = navigation.addListener("focus", () => {
      // alert("Focused")
      AsyncStorage.getItem("directionsList").then((value) => {
        if (value === undefined || value == null) {return;}
        else if (JSON.stringify(datavalue) != value) {updateDataValue(JSON.parse(value))}

      })
      AsyncStorage.getItem("militaryTimeToggle").then((value) => {
        if (value === undefined || value == null) {storeData("militaryTimeToggle", JSON.stringify(false)); return}
        else if (JSON.stringify(militaryTimeSwitch) != value) {toggleMilitaryTimeSwitch(JSON.parse(value))}
      })
      
    })
    return getDirectionsList
  }, [])
  const militaryTimeConvert = {
    "around to the left": "six o'clock",
    "an obtuse left": "seven o'clock",
    "a slightly more than sharp left": "eight o'clock",
    "left": "nine o'clock",
    "a wide left": "ten o'clock",
    "a slight left": "eleven o'clock",
    "seemingly straight ahead": "twelve o'clock",
    "a slight right": "one o'clock",
    "a wide right": "two o'clock",
    "right": "three o'clock",
    "a slightly more than sharp right": "four o'clock",
    "an obtuse right": "five o'clock",
    "around to the right": "six o'clock"

  }
  
  //console.log(datavalue)
  return <View style={isDark == false ? {...styles.container, backgroundColor: "rgb(200,  200, 200)"} : {...styles.container, ...styles.darkThemeColor}}>
    <ScrollView>
    {datavalue.map(elm => {
        //console.log(widthofWin)
        //console.log(elm.iconName)

        return <View key={elm.id} style={{backgroundColor: isDark == false ? "rgb(217, 217, 217)" : "rgb(46, 45, 46)", margin: 10, flexDirection: "row", borderRadius: 20}}>
          <Icon name={militaryTimeSwitch == false ? elm.iconName : `clock-time-${militaryTimeConvert[elm.turnAmount].split(" ")[0]}-outline`} size={100} color={isDark == false ? "#4d4d4d" : "#fafafa"} />
          
          
          <Text style={{textAlign: "center", textAlignVertical: "center", width: widthofWin - 20 - 100, color: isDark == false ? "#4d4d4d" : "#fafafa"}} adjustsFontSizeToFit={true} >Turn {militaryTimeSwitch == false ? elm.turnAmount : militaryTimeConvert[elm.turnAmount]} and continue towards {elm.destination}.</Text>

        </View>
      })}
      <TouchableOpacity onPress={() => {navigation.goBack()}}>
        <View>
      
      <View style={{height: 60, marginVertical: 10,borderRadius: 20, backgroundColor: "rgb(240, 30, 30)", marginHorizontal: 10}}><Icon size={50} style={{marginHorizontal: (widthofWin-70)/2}}name="exit-run" color="#ffffff"/></View>
      </View>
      </TouchableOpacity>
    </ScrollView>
    
  </View>
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%"
  },
  halfcontainer: {
    flex: 0.5,
    height: "100%"
  },
  imageBack: {
    flex: 1
  },
  fullcover: {
    flex: 1
  },
  whiteText: {
    color: "white",
    
  },
  darkThemeColor: {
    backgroundColor: "rgb(84, 84, 84)",
    color: "white",
  },
  whiteThemeColor: {
    backgroundColor: "rgb(214, 214, 214)",
    color: "black",
    
  },
  horizontalmargin: {
    marginHorizontal: 10
  },
  mapSelectBackground: {
    position: "absolute",
    top: 0,
    width: 1024,
    height: 1024,
    transform: [
      {
        translateX: 0
      },
      {
        translateY: 0
      },
    ],
  },
  background: {
    position: 'absolute',
    width: 1200,
    height: 1200,
    zIndex: -1,
    top: 0,
    opacity: 0.9,
    transform: [
      {
        translateX: -100,
      },
      {
        translateY: 0,
      },
    ],      
  }, 
  


});
// {generateIdToName(MapsList).map(elm => {
//       return <View key={elm.id} style={{backgroundColor: darkMode == false ? "rgb(240, 240, 240)" : "rgb(55, 54, 55)", marginVertical: 10, marginHorizontal: 10, flexDirection: "row", borderRadius: 20, padding: 5}}>
//         <Text style={{flex: 0.8}}>{elm.name}</Text>
//         <Pressable style={{flex: 0.2,  borderLeftWidth: 5}} onPress={() => removeName(elm.name)}>
//         <Text style={{textAlign: "center"}}>Xaoeaoeao</Text></Pressable>
//       </View>
//     })}
// // {threeColors.map(item => (
//         <React.Fragment key={elm.id} style={{height: 40, backgroundColor: elm.color, width: 270, top: `${elm.id * 10}%`}}></React.Fragment>
//       ))}, top: (0.3888 * windowWidth), left: -(0.21 * windowWidth * 16 / 9)
export default App;    //<RenderHTML contentWidth={renderHTMLwidth} source={mapPageHTMLObject}/><RenderHTML source={mapPageHTMLObject} contentWidth={renderHTMLwidth}/>, height: 20, width: (windowHeight*(windowWidth/1600)), transform: "rotate(90deg)", position: "absolute", left: (windowWidth/2)