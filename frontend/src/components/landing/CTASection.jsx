import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import Container from "../common/Container";

function CTASection() {
  return (
    <section className="bg-teal-700 py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Join SmartciviConnect Today</h2>
          <p className="mt-5 text-lg leading-8 text-teal-50">
            Create a citizen account to report issues, or explore the services that keep city teams coordinated.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-teal-800 hover:bg-slate-100">
                Create Account
                <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-800">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default CTASection;
