import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="mx-auto max-w-3xl px-4 text-center">
        <Features />
      </div>
      <div className="mt-20" />
      <Footer />
    </main>
  );
}
