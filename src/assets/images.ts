import {ImageSourcePropType} from 'react-native';
const veloraWelcomeScenes = [
  require('./velora-onboarding-scenic-spots.png'),
  require('./velora-onboarding-map.png'),
  require('./velora-onboarding-sessions.png'),
  require('./velora-onboarding-friends-game.png'),
  require('./velora-onboarding-draw-create.png'),
] satisfies ImageSourcePropType[];
const veloraWaterPhotography = {
  emerald: require('./velora-emerald-bay.png'),
  minnewanka: require('./velora-lake-minnewanka.png'),
  jenny: require('./velora-jenny-lake.png'),
  mcdonald: require('./velora-lake-mcdonald.png'),
  yellowstone: require('./velora-yellowstone-lake.png'),
  crater: require('./velora-crater-lake.png'),
  crescent: require('./velora-lake-crescent.png'),
  wahweap: require('./velora-wahweap-bay.png'),
  taupo: require('./velora-lake-taupo.png'),
  jindabyne: require('./velora-lake-jindabyne.png'),
  nahuelHuapi: require('./velora-lake-nahuel-huapi.png'),
  inari: require('./velora-lake-inari.png'),
  bled: require('./velora-lake-bled.png'),
  bohinj: require('./velora-lake-bohinj.png'),
  thingvallavatn: require('./velora-lake-thingvallavatn.png'),
  lomond: require('./velora-loch-lomond.png'),
  biwa: require('./velora-lake-biwa.png'),
  geneva: require('./velora-lake-geneva.png'),
  vanern: require('./velora-lake-vanern.png'),
  rotorua: require('./velora-lake-rotorua.png'),
  garda: require('./velora-lake-garda.png'),
} satisfies Record<string, ImageSourcePropType>;
const veloraWatersMark = require('./velora-waters-mark.png');

export const appAssets = {
  veloraWelcomeScenes,
  veloraWaterPhotography,
  defaultWaterImage: veloraWaterPhotography.emerald,
  veloraWatersMark,
} as const;

export const onboardingImages = appAssets.veloraWelcomeScenes;
export const spotImages: Record<string, ImageSourcePropType> =
  appAssets.veloraWaterPhotography;
export const fallbackSpotImage = appAssets.defaultWaterImage;
