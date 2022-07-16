import ListItemIndexedCache from "./ListItemIndexedCache";

export function getAssignmentsByDeviceId(deviceId: DeviceData["Id"]): AssignmentData[] {
  const { items } = ListItemIndexedCache.getIndex("Assignments", "DeviceId", "many");

  return items[deviceId] || [];
}
