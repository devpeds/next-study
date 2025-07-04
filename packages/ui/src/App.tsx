import { H1, H2 } from "@lib/components/typography";
import TypographySection from "./sections/typography";
import ButtonSection from "./sections/button";
import CodeSection from "./sections/code";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="pb-10">
      <H2 className="mb-5">{title}</H2>
      {children}
    </section>
  );
}

function App() {
  return (
    <main className="py-5 px-10 m-auto max-w-4xl">
      <H1 className="mb-10">@shared/ui</H1>
      <Section title="Typography">
        <TypographySection />
      </Section>
      <Section title="Button">
        <ButtonSection />
      </Section>
      <Section title="Code">
        <CodeSection />
      </Section>
    </main>
  );
}

export default App;
