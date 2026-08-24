function SectionHeading({ eyebrow, title, description, light = false, align = "center" }) {
  return (
    <div className={`mx-auto max-w-2xl ${align === "left" ? "text-left" : "text-center"}`}>
      {eyebrow && (
        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${light ? "text-teal-300" : "text-teal-700 dark:text-teal-400"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-3 text-3xl font-bold tracking-tight sm:text-4xl ${light ? "text-white" : "text-slate-950 dark:text-white"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-7 ${light ? "text-slate-300" : "text-slate-600 dark:text-slate-300"}`}>
          {description}
        </p>
      )}
    </div>
  );
}

export default SectionHeading;
