import deDE from "./de-DE";
import enUS from "./en-US";
import esES from "./es-ES";
import frFR from "./fr-FR";
import jaJP from "./ja-JP";
import koKR from "./ko-KR";
import nlNL from "./nl-NL";
import plPL from "./pl-PL";
import ptBR from "./pt-BR";
import ruRU from "./ru-RU";
import zhHANS from "./zh-HANS";
import zhHANT from "./zh-HANT";
import zhHK from "./zh-HK";
import zhTW from "./zh-TW";

const defaultLocale = "en-US";

const cultures: {[key: string]: string[]} = {
  "en-US": ["nl-NL"],
  "zh-HANT": ["zh-HK", "zh-TW"]
};

const localisations: {[key: string]: {[key: string]: string}} = {
  "de-DE": deDE,
  "en-US": enUS,
  "es-ES": esES,
  "fr-FR": frFR,
  "ja-JP": jaJP,
  "ko-KR": koKR,
  "nl-NL": nlNL,
  "pl-PL": plPL,
  "pt-BR": ptBR,
  "ru-RU": ruRU,
  "zh-HANS": zhHANS,
  "zh-HANT": zhHANT,
  "zh-HK": zhHK,
  "zh-TW": zhTW
};

const getString = (locale: string, key: string) => {
  if (!(locale in localisations)) {
    locale = defaultLocale;
  }
  if (key in localisations[locale]) {
    return localisations[locale][key];
  }
  if (key in localisations[defaultLocale]) {
    return localisations[defaultLocale][key];
  }
  return key;
}

export {
  cultures,
  defaultLocale,
  getString,
  localisations
};