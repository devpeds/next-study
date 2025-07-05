# @shared/ui

UI component library for topics

## Usage

1. Install the package.

   ```bash
   pnpm add @shared/ui --workspace
   ```

   > **Note**
   >
   > `@shared/ui` must be built before usage.

2. Add `@shared/ui/styles.css` on the app's globals.css file.

   ```css
   @import "@shared/ui/styles.css";
   @import "tailwindcss";

   <!-- ...other style configurations -->
   ```

   > **Note**
   >
   > `@shared/ui/styles.css` must be imported before `tailwindcss`.

## Development

```bash
pnpm install

pnpm dev # run dev server for the example app
```

### Folder Structure

- `lib/`: library components
- `src/`: the example app for the library
