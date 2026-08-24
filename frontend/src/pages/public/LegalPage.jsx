import PageHero from "../../components/public/PageHero";
import Container from "../../components/common/Container";

function LegalPage({ type }) {
  const privacy = type === "privacy";

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <PageHero
        eyebrow="SmartciviConnect policy"
        title={privacy ? "Privacy Policy" : "Terms of Service"}
        description={`Effective August 21, 2026. This page explains how SmartciviConnect ${privacy ? "handles information" : "governs use of the platform"}.`}
      />
      <Container className="py-16">
        <article className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 dark:border-slate-800 dark:bg-slate-900">
          {privacy ? (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Information we collect</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Account identity is managed with JWT authentication. We store your name, email, hashed password, role, complaint details, locations, status history, messages, and authorized photo or video evidence so city teams can coordinate a response.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">How information is used</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Data is used to authenticate users, route civic reports, notify participants, measure operational performance, and keep an auditable record of public-service work. We do not sell personal information.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Access and retention</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Role-based access limits complaint and tracking data to the citizens, officers, staff, and administrators involved in that work. Records are retained as needed for civic operations, legal obligations, and service improvement.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Acceptable use</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Use SmartciviConnect for genuine civic reports and authorized city operations. Do not submit false, harmful, unlawful, or deceptive information, and do not attempt to access another role or workspace.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Accounts and roles</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  Public registration creates a citizen account only. Staff, officer, head officer, admin, and super admin access is granted by city administrators. Protected dashboards require a valid JWT and a matching role.
                </p>
              </section>
              <section>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white">Service availability</h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
                  The platform supports civic coordination but is not a substitute for emergency services when immediate physical danger exists. City teams remain responsible for operational decisions made through the system.
                </p>
              </section>
            </>
          )}
          <section>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">Contact</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              Questions about this {privacy ? "policy" : "agreement"} can be sent to hello@smartciviconnect.com.
            </p>
          </section>
        </article>
      </Container>
    </div>
  );
}

export default LegalPage;
