function changeLabel(change) {
  if (!change) return "—";
  return change > 0 ? `+${change}` : String(change);
}

function readLabel(reads) {
  return `${reads} ${reads === 1 ? "read" : "reads"}`;
}

function changeDescription(change) {
  if (!change) return "No change from last week";
  const amount = Math.abs(change);
  const noun = amount === 1 ? "read" : "reads";
  const direction = change > 0 ? "more" : "fewer";
  return `${amount} ${noun} ${direction} than last week`;
}

export function ReadingByPiece({ data, weekHref }) {
  return (
    <section className="secondary-view article-body" aria-labelledby="piece-reading-title">
      <header className="period">
        <h1 id="piece-reading-title">Reading by piece</h1>
        <p>{data.range.label}</p>
      </header>

      {data.writing.length ? (
        <>
          <div className="writing-list-headings" aria-hidden="true">
            <span />
            <span className="writing-current-heading">This week</span>
            <span className="writing-change-heading">Change from last week</span>
          </div>
          <ol className="writing-list">
            {data.writing.map((item) => (
              <li key={item.path}>
                <span className="writing-title">{item.title}</span>
                <span className="writing-reads">{readLabel(item.readers)}</span>
                <span className="writing-change" aria-label={changeDescription(item.change)}>
                  {changeLabel(item.change)}
                </span>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="empty-reading">The first reading by piece appears after a few reads.</p>
      )}

      <a className="text-link" href={weekHref}>
        This week
      </a>
    </section>
  );
}
