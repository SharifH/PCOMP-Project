import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "video": {
        "height": 889,
        "width": 1189
    },
    "emotion_container": {
        "width": 600
    },
    "emotion_icons": {
        "height": 50,
        "paddingLeft": 40,
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "width": 400
    },
    "emotion_icon": {
        "width": 40,
        "height": 40,
        "marginTop": 5,
        "marginLeft": 35
    },
    "emotion_chart": {
        "marginTop": 0,
        "marginRight": "auto",
        "marginBottom": 0,
        "marginLeft": "auto",
        "width": 400
    },
    "icon1": {
        "visibility": "hidden"
    },
    "icon2": {
        "visibility": "hidden"
    },
    "icon3": {
        "visibility": "hidden"
    },
    "icon4": {
        "visibility": "hidden"
    },
    "icon5": {
        "visibility": "hidden"
    },
    "icon6": {
        "visibility": "hidden"
    },
    "bar": {
        "fill": "steelblue",
        "fillOpacity": 0.9
    }
});