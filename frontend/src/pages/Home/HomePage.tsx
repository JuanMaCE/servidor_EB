import { motion } from "framer-motion";
import { Music2, AudioLines, ChartColumnBig, Play } from "lucide-react";
import { Link } from 'react-router-dom'; 
import '../../styles/HomePage.css';

export default function HomePage() {
  
  return (
    <div className="homepage-wrapper">
      <div className="home-glow home-glow-one" />
      <div className="home-glow home-glow-two" />

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-logo">
          <Music2 color="#3b82f6" size={32} />
          <h1>EB Music</h1>
        </div>

          <nav className="nav-links" aria-label="Navegación principal">
            <Link to="/songs">Seqs</Link>
            <Link to="/lyrics">Letras</Link>
          </nav>

        <Link to="/songs" className="btn-login">
          Abrir Studio
        </Link>
      </header>

      <main className="hero">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="badge">Plataforma creada por JuanMaCE</span>

          <h2 className="hero-title">
            Organiza secuencias,
            <br />
            <span className="text-gradient">letras y repertorio</span>
          </h2>

          <p className="hero-desc">
            Gestiona desde un solo lugar los recursos musicales de tu biblioteca.
          </p>

          <div className="hero-buttons">
            <Link to="/songs" className="btn-primary">
              <Play size={20} fill="currentColor" /> Empieza
            </Link>
            
            <Link to="/lyrics" className="btn-secondary">
              Explorar letras
            </Link>
          </div>
        </motion.div>

        <section className="cards-grid">
          <motion.article whileHover={{ y: -8 }} className="card">
            <div className="card-icon icon-blue">
              <Music2 color="#60a5fa" size={32} />
            </div>
            <h3>Secuencias</h3>
            <p>Guarda y localiza las referencias de tus secuencias.</p>
            <Link to="/songs">Gestionar secuencias</Link>
          </motion.article>

          <motion.article whileHover={{ y: -8 }} className="card">
            <div className="card-icon icon-sky">
              <AudioLines color="#38bdf8" size={32} />
            </div>
            <h3>Letras</h3>
            <p>Importa archivos, revisa su contenido y mantén tus letras al día.</p>
            <Link to="/lyrics">Gestionar letras</Link>
          </motion.article>

          <motion.article whileHover={{ y: -8 }} className="card card-muted">
            <div className="card-icon icon-indigo">
              <ChartColumnBig color="#818cf8" size={32} />
            </div>
            <h3>Charts</h3>
            <p>Una vista de charts llegará en una próxima versión.</p>
            <span>Próximamente</span>
          </motion.article>
        </section>
      </main>
    </div>
  );
}
