export function isReddit(url: string) {
    if (url.includes("reddit.com")) {
        return true;
    }
    return false;
}

export function isTwitter(url: string) {
    if (url.includes("x.com")) {
        return true;
    }
    return false;
}