import { getServerSession } from "next-auth";
import SessionData from "./session-data";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
