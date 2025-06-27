import { auth } from "@/auth";
import db from "@/db";

export default async function DynamicPage() {
  const session = await auth();
  const buttonName = session ? "Sign Out" : "Sign In";

  const data = Object.fromEntries(
    Object.entries(db.all()).map(([key, val]) => [key, Array.from<any>(val)])
  );
  return (
    <div>
      <div>Click &quot;{buttonName} Button&quot; on the right upper side</div>
      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
