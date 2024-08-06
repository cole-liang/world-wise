export const formatDate = (
  date: string | null,
  requireWeekday: boolean = true
) => {
  if (date === null) return;
  if (requireWeekday)
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    }).format(new Date(date));

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export const flagemojiToPNG = (flag: string) => {
  // @ts-expect-error: It is a legit usage without any argument. Don't know why typescript complains about this.
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char! - 127397).toLowerCase())
    .join("");
  return `https://flagcdn.com/24x18/${countryCode}.png`;
};

export const countryCodeToUrl = (countryCode: string) => {
  return `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`;
};

export function compareArray(
  a: Array<object | string | bigint | number | boolean> | null,
  b: Array<object | string | bigint | number | boolean> | null
) {
  return JSON.stringify(a) === JSON.stringify(b);
}
