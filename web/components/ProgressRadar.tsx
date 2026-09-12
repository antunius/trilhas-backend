export function ProgressRadar({
  data,
}: {
  data: { category: string; score: number }[];
}) {
  const n = data.length;
  if (n < 3) return null;
  const width = 320;
  const height = 280;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = 78;

  const rings = [0.25, 0.5, 0.75, 1];

  const getCoordinates = (index: number, value: number) => {
    const angle = ((Math.PI * 2) / n) * index - Math.PI / 2;
    const r = radius * (value / 100);
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle),
    };
  };

  const ringPoints = (level: number) =>
    data
      .map((_, i) => {
        const angle = ((Math.PI * 2) / n) * i - Math.PI / 2;
        const r = radius * level;
        return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
      })
      .join(" ");

  const hasAnyData = data.some((d) => d.score > 0);

  const dataPoints = data
    .map((d, i) => {
      const p = getCoordinates(i, Math.max(d.score, hasAnyData ? 4 : 0));
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <div className="radar-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="radar-svg"
        aria-label="Gráfico de radar de domínio por categoria"
      >
        {/* Concentric rings */}
        {rings.map((level) => (
          <polygon
            key={level}
            points={ringPoints(level)}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeDasharray={level < 1 ? "2,2" : undefined}
          />
        ))}

        {/* Axes */}
        {data.map((_, i) => {
          const outer = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={outer.x}
              y2={outer.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        {hasAnyData ? (
          <>
            <polygon
              points={dataPoints}
              fill="hsl(var(--primary) / 0.25)"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
            />
            {data.map((d, i) => {
              const p = getCoordinates(i, Math.max(d.score, 4));
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="hsl(var(--primary))"
                />
              );
            })}
          </>
        ) : null}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = ((Math.PI * 2) / n) * i - Math.PI / 2;
          const labelDist = radius + 25;
          const x = centerX + labelDist * Math.cos(angle);
          const y = centerY + labelDist * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="10"
              fontWeight="500"
              fill="hsl(var(--muted-foreground))"
              fontFamily="var(--font-mono)"
            >
              {d.category}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
