import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Broadcast = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

const TITLE_MAX = 80;
const BODY_MAX = 240;

export function cleanNotice(title: string, body: string): { title: string; body: string } | null {
  const nextTitle = title.trim().slice(0, TITLE_MAX);
  const nextBody = body.trim().slice(0, BODY_MAX);
  if (!nextTitle || !nextBody) return null;
  return { title: nextTitle, body: nextBody };
}

export const ADMIN_EMAIL = "admin@gmail.com";

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}

export async function sendBroadcast(title: string, body: string): Promise<Broadcast> {
  const notice = cleanNotice(title, body);
  if (!notice) throw new Error("Add a title and a message.");
  const createdAt = new Date().toISOString();
  const ref = await addDoc(collection(db, "broadcasts"), {
    title: notice.title,
    body: notice.body,
    createdAt,
  });
  return { id: ref.id, ...notice, createdAt };
}

export function watchBroadcasts(
  onChange: (items: Broadcast[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const notices = query(collection(db, "broadcasts"), orderBy("createdAt", "desc"), limit(12));
  return onSnapshot(
    notices,
    (snap) => {
      onChange(
        snap.docs.map((item) => {
          const data = item.data();
          return {
            id: item.id,
            title: typeof data.title === "string" ? data.title : "",
            body: typeof data.body === "string" ? data.body : "",
            createdAt: typeof data.createdAt === "string" ? data.createdAt : "",
          };
        }),
      );
    },
    (error) => onError(error),
  );
}
