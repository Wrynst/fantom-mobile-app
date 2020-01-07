// @flow
import { Dimensions, PixelRatio, Platform, StatusBar } from "react-native";

const designSizeWidth = 375;
const designSizeHeight = 812;
// $FlowFixMe Map is not recognised by Flow, why?
const cacheMap = new Map();

const { width: deviceScreenWidth, height: deviceHeight } = Dimensions.get(
  "window"
);

/**
 * @method isIphoneX: Return true if device is Iphone X.
 */
export function isIphoneX() {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    (dimen.height === 812 ||
      dimen.width === 812 ||
      dimen.height === 896 ||
      dimen.width === 896)
  );
}

// eslint-disable-next-line no-nested-ternary
const deviceScreenHeight = isIphoneX()
  ? deviceHeight * 0.9
  : Platform.OS === "android"
  ? deviceHeight - StatusBar.currentHeight
  : deviceHeight;

/**
 * @method getWidth: Return the width according to device
 * pixel ratio.
 * @param {number} imgWidth Width in number
 */
export const getWidth = function getWidth(imgWidth: number) {
  if (cacheMap.has(`w${imgWidth}`)) {
    return cacheMap.get(`w${imgWidth}`);
  }
  const requiredWidth = PixelRatio.roundToNearestPixel(
    (imgWidth / designSizeWidth) * deviceScreenWidth
  );
  cacheMap.set(`w${imgWidth}`, requiredWidth);
  return requiredWidth;
};

export const Metrics = {
  screenHeight: Dimensions.get("window").height,
  screenWidth: Dimensions.get("window").width,

  getiPhoneX_Dimensions() {
    return { height: 812, width: 375 };
  },
  getStatusBarHeight() {
    if (Platform.OS === "android") {
      return 0;
    }
    if (deviceHeight === Metrics.getiPhoneX_Dimensions().height) {
      return 44;
    }
    return 20;
  }
};

/**
 * @method getHeight: Return the height according to device
 * pixel ratio.
 * @param {number} imgHeight Height in number
 */
export const getHeight = function getHeight(imgHeight: number): number {
  if (cacheMap.has(`h${imgHeight}`)) {
    // $FlowFixMe
    return cacheMap.get(`h${imgHeight}`);
  }
  const requiredHeight = PixelRatio.roundToNearestPixel(
    (imgHeight / designSizeHeight) * deviceScreenHeight
  );
  cacheMap.set(`h${imgHeight}`, requiredHeight);
  return requiredHeight;
};
