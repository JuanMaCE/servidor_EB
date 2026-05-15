import { motion } from "framer-motion";
import { Music2, AudioLines, ChartColumnBig, Play } from "lucide-react";
import { Link } from 'react-router-dom'; 
import '../../styles/HomePage.css';

export default function HomePage() {
  
  return (
    <div className="homepage-wrapper">
      {/* Background Glow */}
      <div className="bg-glow glow-1" />
      <div className="bg-glow glow-2" />

      {/* Navbar */}
      <header className="navbar">
        <div className="nav-logo">
          <Music2 color="#3b82f6" size={32} />
          <h1>EB Music</h1>
        </div>

        <nav className="nav-links">
          <Link to="/songs">Seqs</Link>
          <Link to="/lyrics">Letras</Link>
          <Link to="/charts">Charts</Link>
        </nav>

        <Link to="/login" className="btn-login" style={{ textDecoration: 'none' }}>
          Login
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
            Encuentra secuencias,
            <br />
            <span className="text-gradient">Letras & Charts</span>
          </h2>

          <p className="hero-desc">
            Descarga, busca y sube canciones y letras 
          </p>

          <div className="hero-buttons">
            <Link to="/studio" className="btn-primary" style={{ textDecoration: 'none' }}>
              <Play size={20} fill="currentColor" /> Empieza
            </Link>
            
            <Link to="/charts" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Explora Charts
            </Link>
          </div>
        </motion.div>

        <section className="cards-grid">
          <motion.div whileHover={{ y: -8 }} className="card">
            <div className="card-icon icon-blue">
              <Music2 color="#60a5fa" size={32} />
            </div>
            <h3>Secuencias</h3>
            <p>Busca cualquier secuencia que necesites.</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="card">
            <div className="card-icon icon-sky">
              <AudioLines color="#38bdf8" size={32} />
            </div>
            <h3>Letras</h3>
            <p>Busca y sube las letras para holylirics</p>
          </motion.div>

          <motion.div whileHover={{ y: -8 }} className="card">
            <div className="card-icon icon-indigo">
              <ChartColumnBig color="#818cf8" size={32} />
            </div>
            <h3>Charts</h3>
            <p>Encuentra nuestros charts</p>
          </motion.div>
        </section>
      </main>
    </div>
  );
}