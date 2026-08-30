import { useEffect, useState } from "react";

export function SiteFooter({ site, revealAtEnd }) {
  const [revealIsArmed, setRevealIsArmed] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!revealAtEnd) return undefined;

    const revealAtScrollEnd = () => {
      const distanceToEnd =
        document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
      if (distanceToEnd <= 1) setIsRevealed(true);
    };

    const animationFrame = window.requestAnimationFrame(() => {
      setRevealIsArmed(true);
      revealAtScrollEnd();
    });

    window.addEventListener("scroll", revealAtScrollEnd, { passive: true });
    window.addEventListener("resize", revealAtScrollEnd);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", revealAtScrollEnd);
      window.removeEventListener("resize", revealAtScrollEnd);
    };
  }, [revealAtEnd]);

  const className = [
    "site-footer",
    revealAtEnd && "site-footer--end-reveal",
    revealIsArmed && "is-armed",
    isRevealed && "is-revealed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={className}>
      {site?.origin ? (
        <a className="footer-brand text-link" href={site.origin}>
          {site.name}
        </a>
      ) : null}
      {site?.repository ? (
        <nav className="footer-nav" aria-label="Primary">
          <a className="text-link" href={site.repository}>
            GitHub
          </a>
        </nav>
      ) : null}
    </footer>
  );
}
