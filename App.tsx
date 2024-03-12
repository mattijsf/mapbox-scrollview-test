/* eslint-disable react-native/no-inline-styles */
import React from "react"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import MapboxScrollViewBug from "./MapboxScrollViewBug"

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <MapboxScrollViewBug />
    </GestureHandlerRootView>
  )
}
