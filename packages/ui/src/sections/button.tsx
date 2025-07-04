import {
  Button,
  FilledButton,
  OutlinedButton,
  Subtitle2,
  TextButton,
} from "@lib";
import { useState } from "react";

type ButtonProps = React.ComponentProps<typeof Button>;
type ButtonVariant = NonNullable<ButtonProps["variant"]>;
type ButtonSize = NonNullable<ButtonProps["size"]>;
type ButtonColor = NonNullable<ButtonProps["color"]>;

type ButtonsRowProps = {
  variant: ButtonVariant;
  color: ButtonColor;
  disabled?: boolean;
};

function ButtonsRow({ variant, color, disabled }: ButtonsRowProps) {
  const ButtonComponent = (() => {
    switch (variant) {
      case "filled":
        return FilledButton;
      case "outlined":
        return OutlinedButton;
      case "text":
        return TextButton;
    }
  })();

  const sizes: ButtonSize[] = ["large", "medium", "small"];

  return (
    <div className="flex items-center justify-center gap-3 mb-5">
      {sizes.map((size) => (
        <ButtonComponent
          key={size}
          color={color}
          size={size}
          disabled={disabled}
        >
          {size[0].toUpperCase() + size.substring(1)}
        </ButtonComponent>
      ))}
    </div>
  );
}

export default function ButtonSection() {
  const [color, setColor] = useState<ButtonColor>("primary");
  const [disabled, setDisabled] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <ButtonsRow variant="filled" color={color} disabled={disabled} />
      <ButtonsRow variant="outlined" color={color} disabled={disabled} />
      <ButtonsRow variant="text" color={color} disabled={disabled} />
      <div className="flex flex-col space-y-5 items-stretch mt-10">
        <div className="flex space-x-5">
          <Subtitle2 className="basis-[72px]">color</Subtitle2>
          <div className="flex-1 flex flex-wrap gap-2">
            {(
              [
                "primary",
                "secondary",
                "success",
                "info",
                "warn",
                "error",
              ] satisfies ButtonColor[]
            ).map(($0) => (
              <Button
                key={$0}
                variant={$0 === color ? "filled" : "outlined"}
                size="small"
                color={$0}
                onClick={() => setColor($0)}
              >
                {$0}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex space-x-5">
          <Subtitle2 className="basis-[72px]">disabled</Subtitle2>
          <div className="flex-1 flex flex-wrap gap-2">
            {[false, true].map(($0) => (
              <Button
                key={String($0)}
                variant={$0 === disabled ? "filled" : "outlined"}
                color={$0 ? "error" : "primary"}
                size="small"
                onClick={() => setDisabled($0)}
              >
                {String($0)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
