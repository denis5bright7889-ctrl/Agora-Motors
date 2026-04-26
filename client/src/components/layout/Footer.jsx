export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-xl py-6 text-sm text-slate-500 flex items-center justify-between">
        <p>© {new Date().getFullYear()} CarMax</p>
        <p>Buy and sell cars with confidence</p>
      </div>
    </footer>
  );
}
