import { getServerSession } from "next-auth";

import authOptions from "@/auth/options";

export default async function DynamicPage() {
  const session = await getServerSession(authOptions);
  const buttonName = session ? "Sign Out" : "Sign In";
  return (
    <div>Click &quot;{buttonName} Button&quot; on the right upper side</div>
  );
}
