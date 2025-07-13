import { cn } from "@lib/utils";

type Children = string | number | boolean | object | undefined | null;

type CodeProps = {
  className?: string;
  children: Children | Children[];
};

function stringify(children: CodeProps["children"]): string {
  if (Array.isArray(children)) {
    return children.map(stringify).join("");
  }

  try {
    return typeof children === "object"
      ? JSON.stringify(children, null, 2)
      : String(children);
  } catch (_) {
    return String(children);
  }
}

export function CodeInline({ className, children }: CodeProps) {
  return (
    <code
      className={cn(
        "bg-gray-200 text-rose-500 rounded-sm px-1 py-0.5",
        "dark:bg-gray-700",
        className,
      )}
    >
      {stringify(children)}
    </code>
  );
}

export function CodeBlock({ className, children }: CodeProps) {
  return (
    <pre
      className={cn(
        "p-4 rounded-lg overflow-scroll",
        "bg-gray-50 text-gray-800",
        className,
      )}
    >
      <code>{stringify(children)}</code>
    </pre>
  );
}
