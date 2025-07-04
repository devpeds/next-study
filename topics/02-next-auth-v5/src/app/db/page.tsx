import { auth } from "@/auth";
import inMemoryDB from "@/db/in-memory";
import { CodeBlock, CodeInline } from "@shared/ui";

export default async function DBPage() {
  const session = await auth();
  const buttonName = session ? "Sign Out" : "Sign In";

  return (
    <div>
      <div className="mb-5">
        Click &quot;{buttonName} Button&quot; on the right upper side
      </div>
      {process.env.ADAPTER_TYPE === "in-memory" && (
        <CodeBlock>{inMemoryDB.all()}</CodeBlock>
      )}
      {process.env.ADAPTER_TYPE === "prisma" && (
        <p>
          Run <CodeInline>pnpm prisma:browse</CodeInline> to open{" "}
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
