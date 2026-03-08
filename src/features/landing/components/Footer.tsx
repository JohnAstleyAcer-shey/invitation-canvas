import logoDark from "@/assets/logo-dark.png";
import logoLight from "@/assets/logo-light.png";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="section-container flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <img src={logoDark} alt="LynxInvitation" className="hidden dark:block h-6 w-6" />
          <img src={logoLight} alt="LynxInvitation" className="block dark:hidden h-6 w-6" />
          <span className="font-display text-lg font-bold">LynxInvitation</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} LynxInvitation. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
