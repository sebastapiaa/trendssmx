export default function PageHero({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="page-hero">
      <div className="page-hero-bg" aria-hidden="true" />
      <h1>{title}</h1>
      <p>{sub}</p>
    </header>
  );
}
