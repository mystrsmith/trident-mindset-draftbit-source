const Index = () => {
  return null;
};

export { Index };

// import { Button } from '@draftbit/ui';
// import React, { useRef } from 'react';
// import { Platform } from 'react-native';
// import { Text, View, Dimensions, Image, StyleSheet } from 'react-native';
// const SnapCarousel = Platform.OS !== 'web' ? require("react-native-snap-carousel"): null;

// const SCREEN_WIDTH = Dimensions.get('screen').width;
// const ITEM_WIDTH = 240;
// const ITEM_HEIGHT = 300;
// const CONTENT_WRAPPER_HEIGHT = 280;

// const Index = ({ upgradeInfo = [] }) => {
//   const [index, setIndex] = React.useState(0);
//   const carouselRef = useRef(null);

//   const _renderItem = ({ item, index }) => {
//     return (
//       <View style={styles.card} key={item?.id}>
//         <Image
//           resizeMode="contain"
//           style={styles.image}
//           source={{
//             uri: item?.image?.url,
//           }}
//         />
//       </View>
//     );
//   };

//   if (upgradeInfo?.length === 0) {
//     return null;
//   }
//   const title = upgradeInfo?.[index]?.title || '';
//   const subTitle = upgradeInfo?.[index]?.sub_title || '';
//   return (
//     <View>
//       <View style={styles.carouselWrapper}>
//         <SnapCarousel.default
//           snapToAlignment="center"
//           activeSlideAlignment="center"
//           ref={carouselRef}
//           data={upgradeInfo}
//           sliderWidth={SCREEN_WIDTH}
//           itemWidth={ITEM_WIDTH}
//           renderItem={_renderItem}
//           onSnapToItem={index => setIndex(index)}
//           useScrollView={true}
//           pagingEnabled={true}
//           inactiveSlideScale={0.7}
//           inactiveSlideOpacity={0.8}
//           swipeThreshold={0.5}
//           horizontal={true}
//           decelerationRate={0}
//           disableIntervalMomentum={true}
//           snapToInterval={SCREEN_WIDTH / 2 - ITEM_WIDTH}
//         />
//       </View>
//       <View style={styles.contentWrapper}>
//         <Text style={styles.title}>{title}</Text>
//         <Text style={styles.subTitle}>{subTitle}</Text>
//       </View>
//       <SnapCarousel.Pagination
//         dotsLength={upgradeInfo?.length}
//         activeDotIndex={index}
//         carouselRef={carouselRef}
//         dotStyle={{
//           width: 15,
//           height: 15,
//           borderRadius: 15,
//           marginHorizontal: 0,
//           backgroundColor: 'white',
//         }}
//         inactiveDotOpacity={0.4}
//         inactiveDotScale={0.6}
//         tappableDots={true}
//       />
//     </View>
//   );
// };

// export { Index };

// const styles = StyleSheet.create({
//   carouselWrapper: {
//     paddingVertical: 40,
//   },
//   card: {
//     backgroundColor: '#130f40',
//     borderRadius: 5,
//     height: ITEM_HEIGHT,
//     padding: 10,
//     borderRadius: 20,
//     borderWidth: 5,
//     borderColor: 'white',
//   },
//   image: {
//     width: undefined,
//     height: undefined,
//     flex: 1,
//   },
//   contentWrapper: {
//     paddingVertical: 15,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   subTitle: {
//     marginTop: 30,
//     fontSize: 15,
//     fontWeight: '300',
//     color: 'white',
//     textAlign: 'center',
//     lineHeight: 25,
//   },
// });
