import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/determine-financial';

interface RequestData {
    texts: string[];
}

interface ApiResponse {
    results: Record<string, {
        "judged_content": {
            'Additional Notes': string;
            'Confidence Percentage': string;
            'Reason': string;
            'Sources': {
                [key: string]: string;
            };
            'Verdict': string;
        };
    }>[];
}

export function testInject() {
  document.body.style.backgroundColor = "orange";
}

export function injectReddit() {
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach(async (p) => {
        const data: RequestData = {
            texts: [
                p.textContent || ''
            ]
        };
        const response = await axios.post<ApiResponse>(
            API_URL,
            data,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        const firstResult = response.data.results[0];
        const judgedContent = firstResult[p.textContent || '']?.judged_content;
        if (judgedContent) {
            console.log(judgedContent.Verdict);
            if (judgedContent.Verdict == 'True') {p.style.backgroundColor = 'lime';} 
            else if (judgedContent.Verdict == 'Misleading') {p.style.backgroundColor = 'orange';} 
            else if (judgedContent.Verdict == 'False') {p.style.backgroundColor = 'red';} 
            else if (judgedContent.Verdict == 'Uknown') {p.style.backgroundColor = 'transparent';}
            p.style.cursor = "pointer";
        }    
    });
}


export function injectTwitter() {
    localStorage.setItem("fakeness", JSON.stringify({}));
    // let uniqueIdCounter = 0;

    // function generateUniqueId(): string {
    //     uniqueIdCounter++;
    //     return `${uniqueIdCounter}`;
    // }

    function replaceAction(p: Element) {
        // where we will decide if we flag text or not
        if (!p.classList.contains("tides-modified")) {
            p.classList.add("tides-modified");
            (p as HTMLElement).style.cursor = "pointer";
            (p as HTMLElement).style.backgroundColor = "yellow";
            return p.innerHTML;
        }
        return p.innerHTML;
    }

    const paragraphs = document.querySelectorAll('div[lang], p[lang]')

    for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        p.innerHTML = replaceAction(p);
    }

    const targetNode = document.body;

    // Create a configuration object that specifies what types of mutations to observe
    const config = { childList: true, subtree: true };
    
    // Create a MutationObserver callback function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const callback = (mutationsList: any, _observer: any) => {
        mutationsList.forEach((mutation: MutationRecord) => {
            // Check if the mutation is an addition of a node and it's an element
            if (mutation.type === 'childList') {
                const paragraphs = (mutation.target as Element).querySelectorAll('div[lang], p[lang]');
                for (let j = 0; j < paragraphs.length; j++) {
                    const p = paragraphs[j];
                    p.innerHTML = replaceAction(p);
                }
            }
        });
    };
    
    // Create a MutationObserver instance
    const observer = new MutationObserver(callback);
    
    // Start observing the target node (the body) for changes
    observer.observe(targetNode, config);
}

export function uninjectReddit() {
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((p) => {
        p.style.backgroundColor = 'transparent';
    });
}
