import AuthApiPanel from "@/components/auth-api-panel";
import * as ClientSessionData from "@/components/session-data/client";
import ServerSessionData from "@/components/session-data/server";
import { ReactNode } from "react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="font-bold text-4xl mb-10">Welcome</h1>
      <Section title="Session Data">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ClientSessionData.UseSession />
          <ClientSessionData.GetSession />
          <ServerSessionData />
        </div>
      </Section>
      <Section
        title="REST API"
        description="Open Network Panel to see requests."
      >
        <AuthApiPanel
          url="/api/auth/signin"
          method="GET"
          action="navigate"
          description="Displays built-in sign-in page."
        />
        <AuthApiPanel
          url="/api/auth/signout"
          method="GET"
          action="navigate"
          description="Displays built-in sign-out page"
        />
        <AuthApiPanel
          url="/api/auth/session"
          method="GET"
          action="fetch"
          description="Returns client-safe session data."
        />
        <AuthApiPanel
          url="/api/auth/csrf"
          method="GET"
          action="fetch"
          description="Returns CSRF token."
        />
        <AuthApiPanel
          url="/api/auth/providers"
          method="GET"
          action="fetch"
          description="Returns a list of configured providers."
        />
        <AuthApiPanel
          url="/api/auth/signin/:provider"
          method="POST"
          description="Starts sign-in flow for a specific provider. CSRF token is required."
        />
        <AuthApiPanel
          url="/api/auth/callback/:provider"
          method="GET"
          description="Handles returning request from OAuth provider during sign-in flow."
        />
        <AuthApiPanel
          url="/api/auth/callback/:provider"
          method="POST"
          description="Handles returning request from OAuth provider during sign-in flow."
        />
        <AuthApiPanel
          url="/api/auth/signout"
          method="POST"
          description="Handles sign-out request. CSRF token is required."
        />
      </Section>
    </div>
  );
}

function Section(props: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const { title, description, children } = props;
  return (
    <section className="flex flex-col w-full">
      <h2 className="font-bold text-2xl">{title}</h2>
      <p className="mt-2 mb-6 text-gray-400">{description}</p>
      {children}
      <hr className="border-gray-600 m-10" />
    </section>
  );
}
