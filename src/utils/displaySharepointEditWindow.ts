import { ListChangeEmitter } from "../hooks/useSubscribeToCacheChanges";
import openTrackedWindow, { hideSharepointUi, OpenTrackedWindowParams } from "./openTrackedWindow";

// If the window is open for three seconds or more, count that as an edit
const minumumTimeToQualifyAsEdit = 1000 * 3;

export default function displaySharepointEditWindow<List extends ListName>(
  list: List,
  id: ListDataMap[List]["ID"],
  onClose?: (props: { isEdit: boolean }) => void
) {
  const url = `https://nycdot.sharepoint.com/sites/RRM_dev/Lists/${list}/EditForm.aspx?ID=${id}`;

  let clickedSave = false;

  const onWindowClose: OpenTrackedWindowParams["onWindowClose"] = ({ location, durationOpen }) => {
    const urlChanged = location?.href && location.href !== url;

    const isEdit = durationOpen >= minumumTimeToQualifyAsEdit || urlChanged;

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
    onReady: (w) => {
      hideSharepointUi(w);

      const onSave = () => {
        clickedSave = true;
      };
    },
    onWindowClose,
  });

  return trackedWindow;
}
