import Container from "../common/Container";

function AuthLayout({ children }) {
  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>
        <div className="mx-auto max-w-md">
          {children}
        </div>
      </Container>
    </section>
  );
}

export default AuthLayout;