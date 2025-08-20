import { CodeInline, H1, Subtitle1 } from "@shared/ui";

export default function Home() {
  return (
    <>
      <H1>Hello World</H1>
      <Subtitle1 className="text-foreground">
        This app is created by <CodeInline>pnpm turbo gen create-topic</CodeInline>
      </Subtitle1>
    </>
  );
}
