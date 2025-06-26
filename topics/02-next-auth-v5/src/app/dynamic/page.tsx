import { auth } from "@/auth";

export default async function DynamicPage() {
  const session = await auth();
  const buttonName = session ? "Sign Out" : "Sign In";
  return (
    <div>Click &quot;{buttonName} Button&quot; on the right upper side</div>
  );
}
