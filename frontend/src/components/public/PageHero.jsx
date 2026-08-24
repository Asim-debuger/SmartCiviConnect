import Container from "../common/Container";

function PageHero({ eyebrow, title, description }) {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-teal-50 py-16 sm:py-20 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <Container>
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-teal-700 dark:text-teal-400">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}

export default PageHero;
