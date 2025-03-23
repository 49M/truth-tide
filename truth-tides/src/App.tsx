import { useEffect, useState } from "react";
import "./App.css";
import { injectReddit, injectTwitter, uninjectReddit, uninjectTwitter } from "./scripts";
import { isReddit, isTwitter } from "./helpers";
import CustomToggle from "./components/ButtonToggle"; // Import the custom toggle

function App() {
  const [id, setId] = useState<number | undefined>(undefined);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [checked, setChecked] = useState(false);

  const inject = () => {
    if (checked && url && id) {
      if (isReddit(url)) {
        console.log("injecting reddit");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectReddit,
        });
      } else if (isTwitter(url)) {
        console.log("injecting twitter");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectTwitter,
        });
      }
    } else if (!checked && url && id) {
      if (isReddit(url)) {
        console.log("uninjecting reddit");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: uninjectReddit,
        });
      } else if (isTwitter(url)) {
        console.log("uninjecting twitter");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: uninjectTwitter,
        });
      }
    }
  };

  const handleTabUpdate = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    _tab: chrome.tabs.Tab
  ) => {
    if (tabId === id && changeInfo.url) {
      setUrl(changeInfo.url);
    }
  };

  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.webNavigation.onCompleted.addListener(inject);

  useEffect(() => {
    async function getTabInfo() {
      const queryOptions = { active: true, currentWindow: true };
      const [tab] = await chrome.tabs.query(queryOptions);
      setId(tab.id);
      setUrl(tab.url);
      setTitle(tab.title);
    }
    getTabInfo();
    inject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, url, checked]);

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center font-poppins">
      <div className="rounded-xl border-2 border-gray-300 p-8 flex flex-col gap-y-2 items-center">
        <div className="text-2xl font-bold text-blue-600">Truth Tides</div>
        <div className="text-xl font-bold text-center">
          Protect yourself from financial misinformation
        </div>
        <div className="text-l font-bold text-center">
          Do you want to know the truth?
        </div>
        <div className="my-4">
          <CustomToggle checked={checked} onChange={onSwitchChange} />
        </div>
        <div className="max-w-[80%] break-all text-sm text-gray-600">
          Webpage being analysed:{" "}
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {title || "Visit Page"}
            </a>
          ) : (
            "no url"
          )}
        </div>
      </div>
    </div>
  );
}

export default App;