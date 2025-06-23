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
          className={`mr-2 px-2 py-0.5 text-lg font-bold rounded-sm ${
            { GET: "bg-amber-800", POST: "bg-blue-800" }[method]
          }`}
        >
          {method}
        </code>
        <h3 className="text-2xl font-bold">
          {url}
          {action && (
            <AuthApiAction
              className="cursor-pointer ml-2 font-bold text-xs text-emerald-300 hover:underline"
              {...(action === "fetch"
                ? { action, url }
                : { action, href: url })}
            />
          )}
        </h3>
      </div>
      <p className="mt-2 whitespace">{description}</p>
    </section>
  );
}

export default AuthApiPanel;
