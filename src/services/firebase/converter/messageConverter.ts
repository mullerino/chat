import { MessageFirebaseProps } from "@/types/Message";
import { FirestoreDataConverter, Timestamp } from "firebase/firestore";

export const messageConverter: FirestoreDataConverter<MessageFirebaseProps> = {
  toFirestore: (message) => {
    const time = message.time instanceof Timestamp
    ? message.time
    : message.time instanceof Date
    ? Timestamp.fromDate(message.time)
    : Timestamp.fromDate(new Date()); 

    return {
      text: message.text,
      time: time,
      senderId: message.senderId,
      status: message.status || "sent",
    };
  },  
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,
      text: data.text,
      time: data.time instanceof Timestamp ? data.time : Timestamp.fromDate(new Date(data.time)),
      senderId: data.senderId,
      status: data.status || "sent",
    };
  }
}
