import { FormEvent } from "react";

interface CreatePostFormProps {
  action?: (formData: FormData) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  children: React.ReactNode;
}

export default function CreatePostForm({
  action,
  onSubmit,
  children,
}: CreatePostFormProps) {
  return (
    <form
      className="p-4 fixed bottom-0 left-0 right-0"
      action={action}
      onSubmit={onSubmit}
    >
      <div className="flex flex-col max-w-sm m-auto bg-background">
        {children}
      </div>
    </form>
  );
}
