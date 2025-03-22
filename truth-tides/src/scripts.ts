export function testInject() {
  document.body.style.backgroundColor = "orange";
}

export function injectReddit() {
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((p) => {
        p.style.backgroundColor = 'yellow';
    });
}

export function injectTwitter() {
    document.body.style.backgroundColor = "blue";
}

export function uninjectReddit() {
    const paragraphs = document.querySelectorAll('p');

    paragraphs.forEach((p) => {
        p.style.backgroundColor = 'transparent';
    });
}