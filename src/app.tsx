import { useEffect, useState } from "react";

import engine from "cohtml/cohtml";
import { bindValue, useValue } from "cs2/api";

import { LocaleContext } from "./context";
import { defaultLocale } from "./localisations";

import MainPanel from "./components/main-panel";
import LaneDirectionTool from "./components/lane-direction-tool";

export default function App() {
  const [locale, setLocale] = useState(defaultLocale);
  const [ldtOpenedPanel, setLdtOpenedPanel] = useState(-1);

  const localeValue = useValue(bindValue("C2VM.TLE", "GetterLocale", "{}"));
  const newLocale = JSON.parse(localeValue);
  if (newLocale.locale && newLocale.locale != locale) {
    setLocale(newLocale.locale);
  }

  useEffect(() => {
    if (ldtOpenedPanel < 0) {
      const keyDownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key == "S") {
          engine.call("C2VM-TLE-Call-KeyPress", JSON.stringify({ctrlKey: event.ctrlKey, key: event.key}));
        }
      };
      document.addEventListener("keydown", keyDownHandler);
      return () => document.removeEventListener("keydown", keyDownHandler);
    }
  }, [ldtOpenedPanel]);

  return (
    <LocaleContext.Provider value={locale}>
      <MainPanel />
      <LaneDirectionTool onChange={setLdtOpenedPanel} />
    </LocaleContext.Provider>
  );
}