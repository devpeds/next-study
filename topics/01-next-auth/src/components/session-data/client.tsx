"use client";

import { getSession, useSession } from "next-auth/react";
import SessionData from "./session-data";
import { useEffect, useState } from "react";

export function UseSession() {
  const session = useSession();

  return (
    <SessionData title="Client" apiName="useSession()" session={session} />
  );
}

export function GetSession() {
  const [session, setSession] = useState<object | null>(null);

  useEffect(() => {
    getSession().then((data) => setSession(data));
  }, []);

  return (
    <SessionData title="Client" apiName="getSession()" session={session} />
  );
}
