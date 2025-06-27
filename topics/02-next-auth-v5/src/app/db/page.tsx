import { auth } from "@/auth";
import inMemoryDB from "@/db/in-memory";

export default async function DBPage() {
  const session = await auth();
  const buttonName = session ? "Sign Out" : "Sign In";

  return (
    <div>
      <div className="mb-5">
        Click &quot;{buttonName} Button&quot; on the right upper side
      </div>
      {process.env.ADAPTER_TYPE === "in-memory" && (
        <pre>
          <code>{JSON.stringify(inMemoryDB.all(), null, 2)}</code>
        </pre>
      )}
      {process.env.ADAPTER_TYPE === "prisma" && (
        <p>
          Run{" "}
          <code className="text-red-500 bg-gray-600 px-1.5 py-1 rounded-sm">
            pnpm prisma:browse
          </code>{" "}
          to open{" "}
          <a
            className="cursor-pointer text-blue-400 underline"
            target="_blank"
            href="http://localhost:5555"
          >
            Prisma Studio
          </a>
        </p>
      )}
    </div>
  );
}
