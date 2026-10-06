import { LinkButton } from "@/components/ui/link-button";
export default function NotFound() {
  return (
    <section className="wrap not-found">
      <p className="eyebrow">404 / Page not found</p>
      <h1>
        A DIFFERENT
        <br />
        DIRECTION.
      </h1>
      <p>The page you’re looking for is unavailable.</p>
      <LinkButton href="/">Return home</LinkButton>
    </section>
  );
}
