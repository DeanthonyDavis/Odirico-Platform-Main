import { branding } from "@/config/branding";
/** Display brand only. Legal references and technical identifiers remain ASCII. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`}>{branding.displayName}</span>
  );
}
