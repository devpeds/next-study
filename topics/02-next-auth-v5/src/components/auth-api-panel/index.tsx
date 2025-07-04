import { Body1, H4 } from "@shared/ui";
import AuthApiAction from "./auth-api-action";

type Props = {
  method: "GET" | "POST";
  url: string;
  action?: "navigate" | "fetch";
  description: string;
};

function AuthApiPanel({ method, url, action, description }: Props) {
  return (
    <section className="flex flex-col pb-10">
      <div className="flex items-center">
        <code
          className={`mr-2 px-2 py-0.5 text-lg font-bold rounded-sm text-white ${
            { GET: "bg-red-600", POST: "bg-blue-600" }[method]
          }`}
        >
          {method}
        </code>
        <H4>
          {url}
          {action && (
            <AuthApiAction
              className="cursor-pointer ml-2 font-bold text-xs text-green-500 hover:underline"
              {...(action === "fetch"
                ? { action, url }
                : { action, href: url })}
            />
          )}
        </H4>
      </div>
      <Body1 className="mt-2 whitespace">{description}</Body1>
    </section>
  );
}

export default AuthApiPanel;
