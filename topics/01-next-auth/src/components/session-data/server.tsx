import { getServerSession } from "next-auth";

import authOptions from "@/auth/options";

import SessionData from "./session-data";

async function ServerSessionData() {
  const session = await getServerSession(authOptions);
  return (
    <SessionData
      title="Server"
      apiName="getServerSession()"
      session={session}
    />
  );
}

export default ServerSessionData;
