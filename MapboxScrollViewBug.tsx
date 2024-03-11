/* eslint-disable react-native/no-inline-styles */
import MapboxGL from "@rnmapbox/maps"
import React, { useMemo } from "react"
import { ScrollView, Text, View, ViewStyle, useWindowDimensions } from "react-native"

const MapboxScrollViewBug = () => {
  const { width: windowWidth } = useWindowDimensions()

  const pageContainer = useMemo(
    (): ViewStyle => ({
      width: windowWidth,
      alignItems: "center",
      justifyContent: "space-around",
    }),
    [windowWidth]
  )

  return (
    <ScrollView
      horizontal
      pagingEnabled
      nestedScrollEnabled
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
    >
      <View style={[pageContainer, { backgroundColor: "aqua" }]}>
        <MapboxGL.MapView style={{ width: "100%", height: "50%" }} />
        <Text>Slide 1</Text>
      </View>
      <View style={[pageContainer, { backgroundColor: "beige" }]}>
        <Text>Slide 2</Text>
      </View>
      <View style={[pageContainer, { backgroundColor: "coral" }]}>
        <Text>Slide 3</Text>
      </View>
    </ScrollView>
  )
}

export default MapboxScrollViewBug
