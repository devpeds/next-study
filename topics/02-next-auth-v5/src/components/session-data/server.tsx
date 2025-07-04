import { auth } from "@/auth";
import SessionData from "./session-data";

async function ServerSessionData() {
  const session = await auth();
  return <SessionData title="Server" apiName="auth()" session={session} />;
}

export default ServerSessionData;
