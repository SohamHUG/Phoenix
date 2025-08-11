import { ThemeProvider } from "@/components/theme/provider";
import LenisProvider from "./lenis-provider";

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <LenisProvider>
        {children}
      </LenisProvider>
    </ThemeProvider>
  );
}