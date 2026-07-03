function App() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-6 text-slate-100">
      <section className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Enterprise Survey Management Platform
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Frontend foundation is ready.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
          React is rendering the interface, Vite is serving the application, and
          Tailwind CSS is providing the styles.
        </p>
        <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
          <span className="size-3 rounded-full bg-emerald-400" aria-hidden="true" />
          Development environment operational
        </div>
      </section>
    </main>
  );
}

export default App;
