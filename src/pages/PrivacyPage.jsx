// src/pages/PrivacyPage.jsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050810] py-12 px-6 transition-colors duration-500">
      <article className="max-w-3xl mx-auto bg-white dark:bg-[#0B1120] p-8 md:p-12 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
        <header className="mb-12 border-b border-slate-100 dark:border-white/10 pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-3">Politique de Confidentialité</p>
          <h1 className="text-3xl md:text-4xl font-black italic text-primary dark:text-white">Confidentialité EMENO</h1>
        </header>

        <div className="space-y-8 text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">Collecte des données</h2>
            <p>EMENO collecte des informations d'identification (nom, téléphone, email) [cite: 70, 71, 72, 73], des informations de compte [cite: 74], des données liées aux livraisons [cite: 78], des données de localisation pour les livreurs [cite: 85] et des données techniques (IP, appareil)[cite: 86, 88, 89].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">Finalités et Base légale</h2>
            <p>Les données servent à gérer les comptes, authentifier les utilisateurs, assurer le suivi des livraisons et respecter les obligations légales[cite: 93, 94, 95, 96, 97, 100].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">Partage et Conservation</h2>
            <p>EMENO ne vend pas vos données[cite: 108]. Elles sont partagées uniquement avec les livreurs, partenaires techniques ou autorités compétentes[cite: 110, 111, 112]. Elles sont conservées uniquement pendant la durée nécessaire au service[cite: 115].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">Vos droits</h2>
            <p>Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité[cite: 126, 127, 128, 129, 130, 131, 132].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">Droit applicable</h2>
            <p>Régie par les lois en vigueur en République Gabonaise[cite: 140, 141].</p>
          </section>
        </div>
      </article>
    </div>
  );
}