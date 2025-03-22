// Function to attach event listeners to paragraphs
function attachEventListeners(paragraphs) {
    paragraphs.forEach((p) => {
        if (!p.classList.contains('bias-paragraph')) {
            // p.classList.add('bias-paragraph');
            // p.style.backgroundColor = 'yellow';
            p.addEventListener('mouseenter', (e) => showPopover(e.target));
            p.addEventListener('mouseleave', hidePopover);
        }
    });
}

// Function to initialize the observer
function initObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const newParagraphs = mutation.target.querySelectorAll('p');
                if (newParagraphs.length > 0) {
                    attachEventListeners(newParagraphs);
                }
            }
        });
    });

    // Start observing the document body for added nodes
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Attach event listeners to existing paragraphs on page load
const initialParagraphs = document.querySelectorAll('p');
attachEventListeners(initialParagraphs);

// Initialize the observer to handle dynamically loaded content
initObserver();

// Popover functions
function showPopover(target) {
    hidePopover();
    const popover = document.createElement('div');
    popover.className = 'bias-popover';
    popover.innerText = '🚨 Strong bias detected, opinion rejected';
    document.body.appendChild(popover);
    const rect = target.getBoundingClientRect();
    popover.style.top = `${window.scrollY + rect.top + 10}px`;
    popover.style.right = `${window.scrollX + rect.right + 10}px`;
}

function hidePopover() {
    const popover = document.querySelector('.bias-popover');
    if (popover) {
        popover.remove();
    }
}