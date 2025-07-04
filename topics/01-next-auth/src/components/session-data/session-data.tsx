import { Body1, CodeBlock, CodeInline, H3 } from "@shared/ui";

type Props = {
  title: string;
  apiName: string;
  session: object | null;
};

function SessionData({ title, apiName, session }: Props) {
  return (
    <section className="flex flex-col basis-2xs items-center p-8 rounded-xl bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
      <H3>{title}</H3>
      <Body1 className="text-lg mt-2">
        Session from <CodeInline>{apiName}</CodeInline>
      </Body1>
      <CodeBlock className="mt-6 w-full h-full">{session}</CodeBlock>
    </section>
  );
}

export default SessionData;
