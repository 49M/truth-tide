import { useEffect, useState } from "react";
import "./App.css";
import { injectReddit, injectTwitter, uninjectReddit } from "./scripts";
import { isReddit, isTwitter } from "./helpers";
import { FormControlLabel, Switch } from "@mui/material";

function App() {
  const [id, setId] = useState<number | undefined>(undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [checked, setChecked] = useState(false);

  const inject = () => {
    if (checked && url && id) {
      if (isReddit(url)) {
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectReddit,
        });
      } else if (isTwitter(url)) {
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectTwitter,
        });
      }
    } else if (!checked && url && id) {
      if (isReddit(url)) {
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: uninjectReddit,
        });
      } else if (isTwitter(url)) {
        // chrome.scripting.executeScript({
        //   target: { tabId: id },
        //   func: uninjectTwitter,
        // });
      }
    } else {
      console.log("cant do stuff ey");
    }
  }

  const handleTabUpdate = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _tab: chrome.tabs.Tab
  ) => {
    if (tabId === id && changeInfo.url) {
      console.log("URL changed to:", changeInfo.url);
      setUrl(changeInfo.url);
    }
  };

  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.webNavigation.onCompleted.addListener(inject)

  useEffect(() => {
    async function getUrl() {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      setId(tab.id);
      setUrl(tab.url);
    }
    getUrl();

    inject();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, url, checked]);

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
  {/* This is your single box */}
  <div className="rounded-xl border-2 border-gray-300 p-8 flex flex-col gap-y-2 items-center">
    <div className="text-2xl font-bold">Truth Tides</div>
    <div className="text-l font-bold text-center">
      Protect yourself from financial misinformation
    </div>
    <FormControlLabel
      control={<Switch checked={checked} onChange={onSwitchChange} />}
      label="Check Bias"
    />
    <div className="max-w-[80%] break-all">url: {url || "no url"}</div>
  </div>
</div>
  );
}

export default App;
