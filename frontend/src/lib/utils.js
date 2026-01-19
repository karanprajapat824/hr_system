export function getInitials(name) {
  return name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDate(isoString) {
  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function formatDateShort(isoString) {
  if (!isoString) return "---";

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "---";

  const day = date.getDate();
  const month = date
    .toLocaleString("en-US", { month: "short" })
    .toLowerCase();
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}


export function formatTime(isoString) {
  if (!isoString) return "---";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "---";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}



