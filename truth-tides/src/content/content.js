const processedElements = new WeakSet();

function hasColorBackground(element) {
  const style = window.getComputedStyle(element);
  const bgColor = style.backgroundColor;
  
  return (bgColor === "lime" || bgColor === "orange" || bgColor === "red");
}

function addEventListeners(element) {
  if (processedElements.has(element)) return;
  element.addEventListener('mouseenter', handleMouseEnter);
  element.addEventListener('mouseleave', handleMouseLeave);
  processedElements.add(element);
}

function handleMouseEnter(event) {
  showPopover(event.target);
}

function handleMouseLeave() {
  hidePopover();
}

function showPopover(target) {
  hidePopover();
  const popover = document.createElement('div');
  popover.id = 'bias-detector-popover';
  // popover.textContent = `🚨 ${message}`;
  popover.textContent = "🚨 Strong bias detected, opinion rejected";
  popover.style.position = 'absolute';
  popover.style.background = 'white';
  popover.style.color = 'black';
  popover.style.padding = '8px 12px';
  popover.style.borderRadius = '4px';
  popover.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
  popover.style.zIndex = '9999';
  popover.style.pointerEvents = 'none';
  
  document.body.appendChild(popover);
  const rect = target.getBoundingClientRect();
  popover.style.top = `${window.scrollY + rect.top - popover.offsetHeight - 5}px`;
  popover.style.left = `${window.scrollX + rect.left}px`;
}

function hidePopover() {
  const popover = document.getElementById('bias-detector-popover');
  if (popover) {
    popover.remove();
  }
}

function scanForColorElements() {
  
  const textElements = document.querySelectorAll('p, span, div');  
  textElements.forEach(element => {
    if (hasColorBackground(element)) {
      addEventListeners(element);
    }
  });
}

const observer = new MutationObserver(() => {
  setTimeout(scanForColorElements, 100);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['style', 'class']
});
