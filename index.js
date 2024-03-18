/**
 * @format
 */

import MapboxGL from "@react-native-mapbox-gl/maps"
import { AppRegistry } from "react-native"
import App from "./App"
import { name as appName } from "./app.json"

import { MAPBOX_ACCESS_TOKEN } from "./.mapbox-access-token"

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN)
MapboxGL.setTelemetryEnabled(false)

AppRegistry.registerComponent(appName, () => App)
