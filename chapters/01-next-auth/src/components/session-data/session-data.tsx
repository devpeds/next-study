import { Session } from "next-auth";

type Props = {
  title: string;
  apiName: string;
  session: object | null;
};

function SessionData({ title, apiName, session }: Props) {
  return (
    <section className="flex flex-col basis-2xs items-center p-8 rounded-xl bg-gray-800 relative overflow-hidden">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-lg mt-2">
        Session from{" "}
        <code className="bg-gray-400 text-red-700 rounded-sm px-2 py-1">
          {apiName}
        </code>
      </p>
      <pre className="mt-6 p-4 w-full h-full bg-gray-100 rounded-lg overflow-scroll">
        <code className="text-sm text-gray-800">
          {session ? JSON.stringify(session, null, 2) : "null"}
        </code>
      </pre>
    </section>
  );
}

export default SessionData;
