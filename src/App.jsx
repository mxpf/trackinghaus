import { useEffect, useState } from "react";
import { loadWeekly } from "./api.js";
import { demoWeekly } from "./demo-data.js";
import { LetterCascade } from "./LetterCascade.jsx";
import { ReadingByPiece } from "./ReadingByPiece.jsx";
import { SiteFooter } from "./SiteFooter.jsx";
import { WeeklyReading } from "./WeeklyReading.jsx";

const demoMode = import.meta.env.DEV && import.meta.env.VITE_USE_LIVE_API !== "true";

function initialState() {
  return demoMode
    ? { status: "ready", data: demoWeekly, code: null }
    : { status: "loading", data: null, code: null };
}

function SetupView({ code }) {
  const message = {
    site_not_configured: "Add your blog details in the Trackinghaus alpha environment settings.",
    storage_not_configured: "Connect the Trackinghaus alpha database in Vercel.",
  }[code];

  return (
    <section className="access-view" aria-labelledby="setup-title">
      <header className="period">
        <h1 id="setup-title">Almost ready</h1>
        <p>Trackinghaus alpha setup</p>
      </header>
      <p className="setup-message">
        {message || "Trackinghaus alpha needs its production configuration."}
      </p>
    </section>
  );
}

function viewFromLocation() {
  const view = new URLSearchParams(window.location.search).get("view");
  return view === "pieces" || view === "writing" ? "pieces" : "week";
}

function locationForView(view) {
  const url = new URL(window.location.href);
  if (view === "pieces") url.searchParams.set("view", "pieces");
  else url.searchParams.delete("view");
  return `${url.pathname}${url.search}${url.hash}`;
}

export function App() {
  const view = viewFromLocation();
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (demoMode) return undefined;

    let active = true;
    loadWeekly()
      .then((data) => {
        if (active) setState({ status: "ready", data, code: null });
      })
      .catch((error) => {
        if (!active) return;
        const status = error.status === 503 ? "setup" : "error";
        setState({ status, data: null, code: error.code });
      });

    return () => {
      active = false;
    };
  }, []);

  const ready = state.status === "ready";
  const site = ready ? state.data.site : null;
  const isArticlePage = ready && view === "pieces";
  const weekHref = locationForView("week");
  const piecesHref = locationForView("pieces");

  let content;
  if (state.status === "loading") {
    content = <p className="loading-copy">Loading this week’s reading…</p>;
  } else if (state.status === "setup") {
    content = <SetupView code={state.code} />;
  } else if (state.status === "error") {
    content = <SetupView code="unknown" />;
  } else if (view === "week") {
    content = <WeeklyReading data={state.data} piecesHref={piecesHref} />;
  } else {
    content = <ReadingByPiece data={state.data} weekHref={weekHref} />;
  }

  return (
    <div className={`app-shell ${isArticlePage ? "is-article-page" : "is-index-page"}`}>
      <header className="brand">
        <a href={ready ? weekHref : undefined}>
          <LetterCascade text="Trackinghaus alpha" />
        </a>
      </header>

      <main
        className={`content ${isArticlePage ? "article-column" : "index-column"}`}
        aria-live="polite"
        aria-busy={state.status === "loading"}
      >
        {content}
      </main>

      <SiteFooter site={site} revealAtEnd={isArticlePage} />
    </div>
  );
}
