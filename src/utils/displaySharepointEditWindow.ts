import { ListChangeEmitter } from "../hooks/useSubscribeToListChanges";
import { OpenTrackedWindowParams } from "./openTrackedWindow";

// If the window is open for three seconds or more, count that as an edit
const minumumTimeToQualifyAsEdit = 1000 * 3;

export default function displaySharepointEditWindow<List extends ListName>(
  list: List,
  id: ListDataMap[List]["ID"],
  onClose: (props: { isEdit: boolean }) => void
) {
  const url = `https://nycdot.sharepoint.com/sites/RRM_dev/Lists/${list}/EditForm.aspx?ID=${id}`;

  const onWindowClose: OpenTrackedWindowParams["onWindowClose"] = ({ location, durationOpen }) => {
    const urlChanged = location && location.href !== url;

    const isEdit = durationOpen >= minumumTimeToQualifyAsEdit || urlChanged;

    if (isEdit) {
      // Ask the cache to refresh
      ListChangeEmitter.emit("change", list);
    }

    if (onClose) {
      onClose({ isEdit });
    }
  };
}