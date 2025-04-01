import { Timestamp } from "firebase/firestore";

export const formatTime = (timestamp: Timestamp) => {
  const date = timestamp.toDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Formatar para sempre ter 2 dígitos
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${hours}:${formattedMinutes}`;
};
