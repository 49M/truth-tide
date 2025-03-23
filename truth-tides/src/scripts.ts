

export async function injectReddit() {
    localStorage.setItem("pageFacts", JSON.stringify({}));
    type ResponseData = {
        "Verdict": "True" | "False" | "Misleading" | "Unknown",
        "Reason": string,
        "Sources": {
            "Source1": string,
            "Source2": string,
        },
        "Additional Notes": string,
        "Confidence Percentage": number
    }
    const API_URL = 'http://127.0.0.1:5000/determine-financial';

    interface RequestData {
        text: string;
    }

    let uniqueIdCounter = 0;

    function generateUniqueId(): string {
        uniqueIdCounter++;
        return `${uniqueIdCounter}`;
    }

    async function replaceAction(p: Element) {
        // where we will decide if we flag text or not
        if (!p.classList.contains("tides-modified") && typeof p.innerHTML === 'string') {
            try {
                const data: RequestData = {
                    text: p.textContent || "",
                };
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                const resdata: ResponseData = (await response.json()).FactCheckResult;

                const existingData = JSON.parse(localStorage.getItem("pageFacts") || "{}");
                const id = generateUniqueId()
                existingData[id] = resdata
                p.classList.add(`tide-id-${id}`)
                localStorage.setItem("pageFacts", JSON.stringify(existingData))
            
    
                p.classList.add("tides-modified");
                (p as HTMLElement).style.cursor = "pointer";
                (p as HTMLElement).style.backgroundColor = "yellow";
                return p.innerHTML;
            } catch (e) {
                console.log(e);
            }
        }
        return p.innerHTML;
    }

    const paragraphs = document.querySelectorAll('p')

    for (let i = 0; i < paragraphs.length; i++) {
        const p = paragraphs[i];
        p.innerHTML = await replaceAction(p);
    }

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const callback = (mutationsList: any, _observer: any) => {
        mutationsList.forEach(async (mutation: MutationRecord) => {
            // Check if the mutation is an addition of a node and it's an element
            if (mutation.type === 'childList') {
                const paragraphs = (mutation.target as Element).querySelectorAll('div[lang], p[lang]');
                for (let j = 0; j < paragraphs.length; j++) {
                    const p = paragraphs[j];
                    p.innerHTML = await replaceAction(p);
                }
            }
        });
    };
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}



export function injectTwitter() {
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
    const config = { childList: true, subtree: true };
    
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
    
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
}

export function uninjectReddit() {
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((p) => {
        p.style.backgroundColor = 'transparent';
        p.classList.remove("tides-modified")
    });
}

export function uninjectTwitter() {
    const paragraphs = document.querySelectorAll('div[lang], p[lang]');

    paragraphs.forEach((p) => {
        (p as HTMLElement).style.backgroundColor = 'transparent';
        p.classList.remove("tides-modified")
    });
}
