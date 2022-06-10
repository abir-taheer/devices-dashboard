import getContextInfo from "./getContextInfo";

function getFormDigestFromSessionStorage() {
  const cachedFormDigest = sessionStorage.getItem("formDigest");

  if (!cachedFormDigest) {
    return null;
  }

  try {
    const { value, expires } = JSON.parse(cachedFormDigest);

    const expiration = new Date(expires);

    if (expiration.getTime() < Date.now()) {
      return null;
    }

    return value;
  } catch (e) {
    // There was an error parsing the sessionstorage value

    window.alert(
      "Error parsing form digest from session storage. Make sure you're storing it correctly."
    );
  }
  return null;
}

export default async function getFormDigest(forceRefresh?: boolean) {
  if (!forceRefresh) {
    // Check to see if there's already something stored in the session storage
    const cachedFormDigest = getFormDigestFromSessionStorage();

    if (cachedFormDigest) {
      return cachedFormDigest;
    }
  }

  const { FormDigestTimeoutSeconds, FormDigestValue } = await getContextInfo();

  const expiration = new Date(Date.now() + FormDigestTimeoutSeconds * 1000);

  sessionStorage.setItem(
    "formDigest",
    JSON.stringify({
      value: FormDigestValue,
      expires: expiration.getTime(),
    })
  );

  return FormDigestValue;
}
