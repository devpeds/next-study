import { Body1, CodeBlock, CodeInline, H3 } from "@lib";

export default function CodeSection() {
  return (
    <>
      <H3 className="mb-1">Inline</H3>
      <Body1 className="mb-4">
        inline code shows like this:{" "}
        <CodeInline>console.log(&quot;hello world&quot;)</CodeInline>
        {", "}
        <CodeInline>{1}</CodeInline>
        {", "}
        <CodeInline>{true}</CodeInline>
        {", "}
        <CodeInline>{{ a: 1, b: true, c: "string" }}</CodeInline>
      </Body1>
      <H3 className="mb-1">Block</H3>
      <CodeBlock>
        code block shows like &quot;this&quot;: {{ a: 1, b: true, c: "string" }}
      </CodeBlock>
    </>
  );
}
