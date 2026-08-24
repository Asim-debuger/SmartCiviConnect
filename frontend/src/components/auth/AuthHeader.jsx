function AuthHeader({
  title,
  description
}) {
  return (
    <div className="mb-8 text-center">

      <h1 className="text-3xl font-bold text-slate-900">
        {title}
      </h1>

      <p className="mt-3 text-slate-600">
        {description}
      </p>

    </div>
  );
}

export default AuthHeader;