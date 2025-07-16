import { ActionButton, NavBar } from "@lib";
import { H2 } from "@lib/components/typography";

import ButtonSection from "./sections/button";
import CodeSection from "./sections/code";
import FabSection from "./sections/fab";
import TextFieldSection from "./sections/textfield";
import TypographySection from "./sections/typography";

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
    <>
      <NavBar
        title="@shared/ui"
        links={[
          { name: "Menu1", href: "#menu1" },
          { name: "Menu2", href: "#menu2" },
          { name: "MenuMenu3", href: "#menu3" },
        ]}
        right={<ActionButton>Sign In</ActionButton>}
      />
      <main className="py-5 px-10 m-auto max-w-4xl">
        <Section title="Typography">
          <TypographySection />
        </Section>
        <Section title="Button">
          <ButtonSection />
        </Section>
        <Section title="Fab">
          <FabSection />
        </Section>
        <Section title="Code">
          <CodeSection />
        </Section>
        <Section title="TextField">
          <TextFieldSection />
        </Section>
      </main>
    </>
  );
}

export default App;
