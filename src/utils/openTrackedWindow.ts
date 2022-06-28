export type OnWindowCloseParams = {
  // If the new window is on a separate origin, we won't be able to access its location
  location: Location | null;
  openedAt: Date;
  durationOpen: number;
};

export type OpenTrackedWindowParams = {
  onWindowClose?: (props: OnWindowCloseParams) => void;
  shouldCloseWindow?: (w: WindowProxy) => boolean;
  onReady?: (w: WindowProxy) => void;
  url: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  height?: number;
  width?: number;
  popup?: boolean;
  left?: number;
  top?: number;
  checkInterval?: number;
  focusOnOpen?: boolean;
};
export function hideSharepointUi(w: WindowProxy, attempt: number = 0) {
  function hideElement(selector: string) {
    const el = w.document?.querySelector?.(selector);
    if (el) {
      // @ts-ignore
      el.style.display = "none";
    } else if (attempt < 3) {
      // The page might not be loaded yet, try again in a second but if it fails 3 times then give up
      setTimeout(hideSharepointUi, 1000, w, attempt + 1);
    }
  }

  hideElement(".od-Command--Comment");
  hideElement(".od-SuiteNav");
  hideElement(".od-SuiteNav");
  hideElement(".od-SuiteNav");
  hideElement(".Files-rightPane");
  hideElement(".Files-leftNav");
  hideElement(".sp-appBar");
}

export default function openTrackedWindow({
  onWindowClose,
  shouldCloseWindow,
  url,
  height = 600,
  width = 600,
  target = "_blank",
  popup = true,
  left = 0,
  top = 0,
  checkInterval = 200,
  focusOnOpen = true,
  onReady,
}: OpenTrackedWindowParams) {
  let windowFeatures: string = "";

  if (width) {
    windowFeatures += `width=${width},`;
  }

  if (height) {
    windowFeatures += `height=${height},`;
  }

  if (popup) {
    windowFeatures += "popup=true,";
  }

  if (left) {
    windowFeatures += `left=${left},`;
  }

  if (top) {
    windowFeatures += `top=${top},`;
  }

  let interval: ReturnType<typeof setTimeout>;

  const trackedWindow = window.open(url, target, windowFeatures);
  const openedAt = new Date();

  if (focusOnOpen) {
    trackedWindow.focus();
  }

  let calledReady = false;
  let location: Location | null = null;

  const checkState = () => {
    try {
      const newLocation = trackedWindow.location;
      if (newLocation && newLocation.href) {
        location = newLocation;
      }
    } catch (er) {
      // We're not allowed to access the location of the popup
      // Just don't do anything for now
    }

    try {
      if (trackedWindow?.document?.readyState === "complete" && !calledReady && onReady) {
        onReady(trackedWindow);
        calledReady = true;
      }
    } catch (er) {
      console.error(er);
    }

    if (trackedWindow.closed && onWindowClose) {
      clearInterval(interval);
      const now = new Date();
      const durationOpen = now.getTime() - openedAt.getTime();
      onWindowClose({ location, openedAt, durationOpen });
    }

    // If the user navigates away from the url that was provided, then we close the window for convenience
    if (shouldCloseWindow && shouldCloseWindow(trackedWindow)) {
      trackedWindow.close();
    }
  };

  interval = setInterval(checkState, checkInterval);

  return trackedWindow;
}
