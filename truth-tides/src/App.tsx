import { useEffect, useState } from 'react';
import './App.css'
import { injectReddit, injectTwitter } from './scripts';
import { isReddit, isTwitter } from "./helpers"

function App() {
  const [id, setId] = useState<number | undefined>(undefined)
  const [url, setUrl] = useState<string | undefined>(undefined);
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

  return (
    <div className="h-screen w-screen flex flex-col gap-y-2 items-center justify-center py-20">
      <div className='rounded-md hover:cursor-pointer w-20 h-20 bg-blue-300 text-black flex items-center justify-center' onClick={onClick}>inject</div>
      <div>tab id: {id || "no id"}</div>
      <div>url: {url || "no url"}</div>
    </div>
  )
}

export default App
