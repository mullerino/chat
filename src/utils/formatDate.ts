import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Timestamp | undefined) => {
  if(!date) return
  
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return date.toDate().toLocaleDateString("pt-BR", options);
};
