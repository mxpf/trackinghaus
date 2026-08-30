import { useEffect, useRef } from "react";

function splitDetail(detail) {
  const boundary = detail.indexOf(". ");
  if (boundary === -1) return [detail, ""];
  return [detail.slice(0, boundary + 1), detail.slice(boundary + 2)];
}

function TrendChart({ days }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(bounds.width * ratio);
      canvas.height = Math.round(bounds.height * ratio);

      const context = canvas.getContext("2d");
      if (!context) return;

      context.scale(ratio, ratio);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const styles = getComputedStyle(document.documentElement);
      const ink = styles.getPropertyValue("--ink").trim() || "#eeede9";
      const labelInset = 24;
      const left = labelInset;
      const right = bounds.width - labelInset;
      const pointTop = 29;
      const pointBottom = 78;
      const values = days.map((item) => item.value);
      const minimum = Math.min(...values);
      const maximum = Math.max(...values);
      const spread = maximum - minimum;
      const points = days.map((item, index) => ({
        x: left + (index * (right - left)) / Math.max(days.length - 1, 1),
        y:
          spread === 0
            ? (pointTop + pointBottom) / 2
            : pointBottom -
              ((item.value - minimum) / spread) * (pointBottom - pointTop),
      }));

      context.strokeStyle = ink;
      context.lineWidth = 1;
      context.lineJoin = "round";
      context.lineCap = "round";
      context.beginPath();
      points.forEach((point, index) => {
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      });
      context.stroke();

      context.fillStyle = ink;
      points.forEach((point) => {
        context.beginPath();
        context.arc(point.x, point.y, 3, 0, Math.PI * 2);
        context.fill();
      });

      const family = '"Untitled Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
      context.font = `400 16px ${family}`;
      context.textBaseline = "top";

      days.forEach((item, index) => {
        context.textAlign = "center";
        context.fillText(item.date, points[index].x, 154);
      });
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [days]);

  const caption = `Daily reads from ${days[0]?.date || "the start of the week"} through ${days.at(-1)?.date || "today"}: ${days.map((day) => day.value).join(", ")}.`;

  return (
    <figure className="trend" aria-labelledby="trend-caption">
      <canvas ref={canvasRef} className="trend-canvas" aria-hidden="true" />
      <figcaption id="trend-caption" className="visually-hidden">
        {caption}
      </figcaption>
    </figure>
  );
}

export function WeeklyReading({ data, piecesHref }) {
  const [firstDetail, secondDetail] = splitDetail(data.insight.detail);

  return (
    <section aria-labelledby="week-title">
      <header className="period">
        <h1 id="week-title">This week</h1>
        <p>{data.range.label}</p>
      </header>

      <div className="insight">
        <h2>{data.insight.headline}</h2>
        <p>
          <span className="nowrap">{firstDetail}</span>
          {secondDetail ? (
            <>
              <br />
              {secondDetail}
            </>
          ) : null}
        </p>
      </div>

      <TrendChart days={data.days} />

      <section className="evidence" id="evidence" aria-labelledby="evidence-title">
        <h2 id="evidence-title">What changed</h2>
        <dl>
          {data.evidence.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                {item.value} {item.suffix}
              </dd>
            </div>
          ))}
        </dl>
        {data.evidenceNote ? <p>{data.evidenceNote}</p> : null}
        <p className="piece-reading-link">
          See this week’s{" "}
          <a className="inline-link" href={piecesHref}>
            reading by piece
          </a>
          , including how each changed from last week.
        </p>
      </section>
    </section>
  );
}
