import { useEffect, useState } from "react";

import { LocaleContext } from "./context";
import { engineCall, isEngine } from "./engine";
import { defaultLocale } from "./localisations";

import MainPanel from "./components/main-panel";
import LaneDirectionTool from "./components/lane-direction-tool";

export default function App() {
  const [locale, setLocale] = useState(defaultLocale);
  const [ldtOpenedPanel, setLdtOpenedPanel] = useState(-1);

  const updateLocale = async (result : string) => {
    const newLocale = JSON.parse(result);
    if (newLocale.locale) {
      setLocale(newLocale.locale);
    }
  };

  useEffect(() => {
    if ("engine" in window && isEngine(window.engine)) {
      const listener = window.engine.on("C2VM-TLE-Event-UpdateLocale", (result) => updateLocale(result));
      engineCall("C2VM-TLE-Call-UpdateLocale");
      return () => {
        listener.clear();
      };
    }
  }, []);

  useEffect(() => {
    if (ldtOpenedPanel < 0) {
      const keyDownHandler = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key == "S") {
          engineCall("C2VM-TLE-Call-KeyPress", JSON.stringify({ctrlKey: event.ctrlKey, key: event.key}));
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