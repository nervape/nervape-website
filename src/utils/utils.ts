// eslint-disable-next-line consistent-return
export function getWindowWidthRange() {
    const { width } = window.screen;
    if (width < 750) return 375;
    if (width >= 750 && width < 1200) return 750;
    if (width >= 1200) return 1200;
}

export function scrollToTop() {
    const sTop = document.documentElement.scrollTop || document.body.scrollTop;
    console.log('scrollToTop', sTop);
    if (sTop > 0) {
        // window.requestAnimationFrame(scrollToTop);
        window.scrollTo(0, 0);
    }
}
