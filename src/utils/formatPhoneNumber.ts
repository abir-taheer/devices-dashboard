export default function formatPhoneNumber(phone: string) {
  const area = phone.slice(0, 3);
  const parts = [phone.slice(3, 6), phone.slice(6, 10)].filter(Boolean);

  let text = ``;

  if (parts.length) {
    text += `(${area}) `;

    text += parts.filter(Boolean).join("-");
  } else {
    return phone;
  }

  return text;
}
