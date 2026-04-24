import * as StyleSheet from './utils/StyleSheet';

import Breakpoints from './utils/Breakpoints';

import palettes from './themes/palettes';

export const ActionSheetItemStyles = theme =>
  StyleSheet.create({
    'Action Sheet Item': { style: { textAlign: 'center' }, props: {} },
  });

export const SliderStyles = theme =>
  StyleSheet.create({
    Slider: { style: { marginLeft: 12, marginRight: 12 }, props: {} },
  });

export const ViewStyles = theme =>
  StyleSheet.create({
    'Menu View': {
      style: {
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: palettes.Brand.Light_Inverse,
        flexDirection: 'row',
        height: 60,
        paddingLeft: 20,
        paddingRight: 10,
      },
      props: {},
    },
    Screen_Header: {
      style: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 48,
        justifyContent: 'center',
      },
      props: {},
    },
    'iOS Margin View': { style: { height: 50 }, props: {} },
  });

export const TextStyles = theme =>
  StyleSheet.create({
    'Dashboard Label': {
      style: {
        color: palettes.App['Custom Color'],
        fontFamily: 'Poppins_300Light',
        fontSize: 10,
        lineHeight: 16,
        marginTop: 5,
        textAlign: 'center',
      },
      props: {},
    },
    'Dashboard Value': {
      style: {
        color: palettes.App['Custom Color'],
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 21,
        marginLeft: 8,
      },
      props: {},
    },
    'Data Label': {
      style: { fontFamily: 'Poppins_300Light', fontSize: 16 },
      props: {},
    },
    'Error Label': {
      style: {
        color: theme.colors.background.danger,
        fontFamily: 'Poppins_400Regular',
        fontSize: 15,
        marginBottom: 8,
        marginTop: 12,
        textAlign: 'left',
      },
      props: {},
    },
    'Menu Name': {
      style: {
        color: palettes.App['Custom Color'],
        flex: 1,
        fontFamily: 'Rasa_400Regular',
        fontSize: 20,
        paddingTop: 2,
      },
      props: {},
    },
    Screen_Title: {
      style: { fontFamily: 'Poppins_500Medium', fontSize: 21 },
      props: {},
    },
    Text: { style: { fontFamily: 'Poppins_500Medium' }, props: {} },
  });

export const AccordionGroupStyles = theme =>
  StyleSheet.create({
    Accordion: {
      style: {
        fontSize: 16,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
      },
      props: {},
    },
  });

export const FetchStyles = theme =>
  StyleSheet.create({ Fetch: { style: { minHeight: 40 }, props: {} } });

export const TextInputStyles = theme =>
  StyleSheet.create({
    'Form Inputs': {
      style: {
        borderColor: palettes.Brand.Light_Inverse,
        borderRadius: 8,
        borderWidth: 1,
        fontFamily: 'Rasa_400Regular',
        fontSize: 17,
        height: 44,
        marginBottom: 16,
        marginTop: 6,
        paddingLeft: 16,
        paddingRight: 16,
      },
      props: { placeholderTextColor: theme.colors.text.light },
    },
    'Text Area': {
      style: {
        borderBottomWidth: 1,
        borderColor: theme.colors.border.brand,
        borderLeftWidth: 1,
        borderRadius: 8,
        borderRightWidth: 1,
        borderTopWidth: 1,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
      },
      props: {},
    },
    'Text Input': {
      style: {
        borderBottomWidth: 1,
        borderColor: theme.colors.border.brand,
        borderLeftWidth: 1,
        borderRadius: 8,
        borderRightWidth: 1,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 8,
      },
      props: {},
    },
  });

export const ButtonStyles = theme =>
  StyleSheet.create({
    'Action Button': {
      style: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        height: 44,
        textAlign: 'center',
      },
      props: {},
    },
    Button: {
      style: {
        borderRadius: 8,
        fontFamily: 'System',
        fontWeight: '700',
        textAlign: 'center',
      },
      props: {},
    },
  });

export const WebViewStyles = theme =>
  StyleSheet.create({ 'Web View': { style: { flex: 1 }, props: {} } });

export const SurfaceStyles = theme =>
  StyleSheet.create({ Surface: { style: { minHeight: 40 }, props: {} } });

export const ImageBackgroundStyles = theme =>
  StyleSheet.create({
    'Image Background': { style: { flex: 1 }, props: {} },
    'Screen BG Image': {
      style: {
        bottom: 0,
        flex: 1,
        left: 0,
        opacity: 0.4,
        position: 'absolute',
        right: 0,
        top: 0,
      },
      props: {},
    },
  });

export const VideoPlayerStyles = theme =>
  StyleSheet.create({
    'BG Player': {
      style: {
        bottom: -30,
        height: '100%',
        left: 0,
        opacity: 0.3,
        position: 'absolute',
        right: 0,
        top: 0,
        width: '100%',
      },
      props: {},
    },
    Video: { style: { height: 215 }, props: {} },
  });

export const LinearGradientStyles = theme =>
  StyleSheet.create({
    Linear: {
      style: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-evenly',
        opacity: 1,
        width: '100%',
      },
      props: {
        color1: palettes.App.Black_Alpha_80,
        color2: palettes.App['Background 90 Opacity'],
        color3: palettes.App.Black_Alpha_80,
      },
    },
    'Linear Gradient': { style: { flex: 1 }, props: {} },
  });

export const CircleStyles = theme =>
  StyleSheet.create({
    Circle: {
      style: {
        alignItems: 'center',
        backgroundColor: theme.colors.branding.primary,
        justifyContent: 'center',
      },
      props: {},
    },
  });

export const DeckSwiperStyles = theme =>
  StyleSheet.create({
    'Deck Swiper': { style: { position: 'absolute' }, props: {} },
  });

export const DeckSwiperCardStyles = theme =>
  StyleSheet.create({
    'Deck Swiper Card': {
      style: {
        alignItems: 'center',
        borderWidth: 2,
        justifyContent: 'center',
        padding: 20,
      },
      props: {},
    },
  });

export const SwiperStyles = theme =>
  StyleSheet.create({
    Swiper: { style: { height: 300, width: '100%' }, props: {} },
  });

export const AudioPlayerStyles = theme =>
  StyleSheet.create({
    'Audio Player': {
      style: {
        alignItems: 'center',
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: 'row',
        padding: 8,
      },
      props: {},
    },
  });

export const BlurViewStyles = theme =>
  StyleSheet.create({
    'Blur View': {
      style: { flexBasis: 0, flexGrow: 1, flexShrink: 1 },
      props: {},
    },
  });

export const ActivityIndicatorStyles = theme =>
  StyleSheet.create({
    'Activity Indicator': { style: { height: 36, width: 36 }, props: {} },
  });

export const TabViewItemStyles = theme =>
  StyleSheet.create({ 'Tab View Item': { style: { flex: 1 }, props: {} } });

export const ImageStyles = theme =>
  StyleSheet.create({
    Image: { style: { height: 100, width: 100 }, props: {} },
  });

export const DividerStyles = theme =>
  StyleSheet.create({ Divider: { style: { height: 1 }, props: {} } });

export const ExpoImageStyles = theme =>
  StyleSheet.create({
    'Image 10': { style: { height: 100, width: 100 }, props: {} },
    'Image 11': { style: { height: 100, width: 100 }, props: {} },
    'Image 12': { style: { height: 100, width: 100 }, props: {} },
    'Image 13': { style: { height: 100, width: 100 }, props: {} },
    'Image 14': { style: { height: 100, width: 100 }, props: {} },
    'Image 15': { style: { height: 100, width: 100 }, props: {} },
    'Image 16': { style: { height: 100, width: 100 }, props: {} },
    'Image 17': { style: { height: 100, width: 100 }, props: {} },
    'Image 18': { style: { height: 100, width: 100 }, props: {} },
    'Image 19': { style: { height: 100, width: 100 }, props: {} },
    'Image 2': { style: { height: 100, width: 100 }, props: {} },
    'Image 20': { style: { height: 100, width: 100 }, props: {} },
    'Image 21': { style: { height: 100, width: 100 }, props: {} },
    'Image 3': { style: { height: 100, width: 100 }, props: {} },
    'Image 4': { style: { height: 100, width: 100 }, props: {} },
    'Image 5': { style: { height: 100, width: 100 }, props: {} },
    'Image 6': { style: { height: 100, width: 100 }, props: {} },
    'Image 7': { style: { height: 100, width: 100 }, props: {} },
    'Image 8': { style: { height: 100, width: 100 }, props: {} },
    'Image 9': { style: { height: 100, width: 100 }, props: {} },
  });

export const PickerStyles = theme =>
  StyleSheet.create({ Picker: { style: {}, props: {} } });

export const LinkStyles = theme =>
  StyleSheet.create({
    Link: { style: { color: theme.colors.branding.primary }, props: {} },
  });
