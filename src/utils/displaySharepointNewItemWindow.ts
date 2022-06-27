import { ListChangeEmitter } from "../hooks/useSubscribeToCacheChanges";
import openTrackedWindow, { OpenTrackedWindowParams } from "./openTrackedWindow";

// If the popup is open for at least 3 seconds then qualify it as an edit
const minimumTimeToQualifyAsEdit = 1000 * 3;

/*
  What this function does: 

  * It opens a popup with the url to create a new item in the list that is passed
  * If the popup is open for at least 3 seconds before it is closed then it triggers the cache to refresh
  * If the popup navigates to a url that is not the url that was passed then it triggers the popup to close and the cache to refresh
*/
export default function displaySharepointNewItemWindow(
  list: ListName,
  onClose?: (props: { isEdit: boolean }) => void
) {
  const url = `https://nycdot.sharepoint.com/sites/RRM_dev/Lists/${list}/NewForm.aspx`;

  const onWindowClose: OpenTrackedWindowParams["onWindowClose"] = ({ location, durationOpen }) => {
    const urlChanged = location?.href && location.href !== url;

    const isEdit = durationOpen >= minimumTimeToQualifyAsEdit || urlChanged;

    if (isEdit) {
      // Ask the cache to refresh
      ListChangeEmitter.emit("change", list);
    }

    if (onClose) {
      onClose({ isEdit });
    }
  };

  const trackedWindow = openTrackedWindow({
    url,
    shouldCloseWindow: (w) => {
      try {
        return w.location.href && w.location.href !== "about:blank" && w.location.href !== url;
      } catch (er) {
        return false;
      }
    },
    onWindowClose,
  });

  return trackedWindow;
}
