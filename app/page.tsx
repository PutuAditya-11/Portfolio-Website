    import Header from "./comps/Header";
  import Hero from "./comps/Hero";
  import About from "./comps/About";
  import Projects from "./comps/Projects";
  import Contact from "./comps/Contact";
  import Footer from "./comps/Footer";

  export default function Home() {
    return (
      <>
      <Header />
      <main>
      <Hero />
      <About />
      <Projects />
      <Contact />
      </main>
      <Footer />
      </>
    );
  }
