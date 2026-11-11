import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Confirmation from './pages/Confirmation';
import AdminLoginModal from './components/admin/AdminLoginModal';
import AdminPanel from './components/admin/AdminPanel';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="surface max-w-lg p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600">
          <Compass className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-600">
          Error 404
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
          Esta ruta no existe
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          El enlace que buscas no forma parte del diagnóstico. Vuelve al inicio para comenzar.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  const openAdminAccess = () => {
    if (adminOpen) return;
    setLoginOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setAdminOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header onAdminClick={openAdminAccess} />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/confirmacion" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />

      <AdminLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />
      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} />
    </div>
  );
}
