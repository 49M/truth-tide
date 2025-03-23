// import axios from 'axios';

// const API_URL = 'http://127.0.0.1:5000/determine-financial';

// interface RequestData {
//     texts: string[];
// }

// interface ApiResponse {
//     results: Record<string, {
//         "judged_content": {
//             'Additional Notes': string;
//             'Confidence Percentage': string;
//             'Reason': string;
//             'Sources': {
//                 [key: string]: string;
//             };
//             'Verdict': string;
//         };
//     }>[];
// }

export function testInject() {
  document.body.style.backgroundColor = "orange";
}

export function injectReddit() {
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

    const paragraphs = document.querySelectorAll('p')

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
    });
}
