export const safeExitFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {
      console.error("Failed to exit fullscreen. Likely already minimized.");
    });
  }
};

export const delayOpenSite = (site: string, delay?: number) => {
  setTimeout(() => {
    window.open(site, "_blank");
  }, delay || 600);
};
