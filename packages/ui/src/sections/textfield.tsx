import { TextField } from "@lib";

export default function TextFieldSection() {
  return (
    <div className="space-y-5">
      <TextField id="textfield-section-default" label="Default" />
      <TextField
        id="textfield-section-placeholder"
        label="Placeholder"
        placeholder="Placeholder Here"
      />
      <TextField
        id="textfield-section-password"
        label="Password"
        type="password"
        placeholder="Password Here"
      />
    </div>
  );
}
