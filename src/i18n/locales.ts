export const LOCALES : {[key: string]: string;} = {
    ENGLISH: "en",
    JAPANESE: "ja",
    FRENCH: "fr",
    GERMAN: "de",
    SPANISH: "es",

};

export const getLocaleByString = (localeString: string) => {
  for (const key in LOCALES) {
    if (LOCALES[key] === localeString) {
      return key;
    }
  }
  return null;
}

export const existLocate = (localeString: string) => {
  return getLocaleByString(localeString) ? true : false;
}