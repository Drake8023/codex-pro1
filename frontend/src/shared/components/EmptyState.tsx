export function EmptyState({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="empty-state glass-panel">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}
