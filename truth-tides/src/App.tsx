import { useEffect, useState } from 'react';
import './App.css'
import { injectReddit, injectTwitter, uninjectReddit } from './scripts';
import { isReddit, isTwitter } from "./helpers"
import { FormControlLabel, Switch } from '@mui/material';

function App() {
  const [id, setId] = useState<number | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function getUrl() {
      const queryOptions = { active: true, currentWindow: true };
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      const [tab] = await chrome.tabs.query(queryOptions);
      setId(tab.id)
      setUrl(tab.url)
    }
    getUrl()
  })


  const onClick = () => {
    if (id && url) {

      if (isReddit(url)) {
        console.log("injecting reddit");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectReddit
        });
      } else if (isTwitter(url)) {
        console.log("injecting twitter");
        chrome.scripting.executeScript({
          target: { tabId: id },
          func: injectTwitter
        });
      }

    } else {
      console.log("fail");
    }
  }

  const onSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (event.target.checked) {
      onClick();
    } else {
      if (id && url) {
        if (isReddit(url)) {
          chrome.scripting.executeScript({
          target: { tabId: id },
          func: uninjectReddit
          });
        }
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col gap-y-2 items-center justify-center py-20 rounded-xl">
      <div className="text-2xl font-bold">Truth Tides</div>
      <FormControlLabel control={<Switch checked={checked} onChange={onSwitchChange} />} label="Check Bias" />
      <div>url: {url || "no url"}</div>
    </div>
  )
}

export default App
