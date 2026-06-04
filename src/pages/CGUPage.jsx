// src/pages/CGUPage.jsx
export default function CGUPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050810] py-12 px-6 transition-colors duration-500">
      <article className="max-w-3xl mx-auto bg-white dark:bg-[#0B1120] p-8 md:p-12 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-xl">
        <header className="mb-12 border-b border-slate-100 dark:border-white/10 pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary mb-3">Mise à jour : Juin 2026</p>
          <h1 className="text-3xl md:text-4xl font-black italic text-primary dark:text-white">Conditions Générales d'Utilisation</h1>
        </header>

        <div className="space-y-8 text-slate-600 dark:text-slate-400">
          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">1. Objet</h2>
            <p>Les présentes CGU définissent les modalités d'accès et d'utilisation de la plateforme EMENO[cite: 5]. Elle permet la gestion, le suivi et l'exécution de livraisons[cite: 6].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">2. Acceptation</h2>
            <p>Toute utilisation implique l'acceptation pleine et entière des présentes conditions[cite: 8, 9].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">3. Création de compte</h2>
            <p>L'utilisateur s'engage à fournir des informations exactes, préserver la confidentialité de ses identifiants et signaler toute utilisation non autorisée[cite: 12, 14, 15, 16]. EMENO se réserve le droit de suspendre tout compte frauduleux[cite: 17].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">4. Utilisation du service</h2>
            <p>Il est interdit de transmettre des informations trompeuses, d'utiliser la plateforme à des fins illégales ou de tenter des accès non autorisés[cite: 21, 22, 23, 24, 26].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">5. Obligations des livreurs</h2>
            <p>Les livreurs doivent respecter les instructions, assurer la prise en charge des colis, respecter les délais et adopter un comportement professionnel[cite: 28, 29, 30, 31, 32].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">6. Responsabilité</h2>
            <p>EMENO ne garantit pas une disponibilité continue et décline toute responsabilité en cas de force majeure ou d'utilisation abusive[cite: 36, 39, 40].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">7. Propriété intellectuelle</h2>
            <p>Tous les éléments (logos, textes, logiciels) sont protégés. Toute reproduction est interdite[cite: 42, 43].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">8 à 11. Divers</h2>
            <p>La protection des données est traitée dans la politique dédiée[cite: 46]. EMENO peut résilier un compte en cas de violation[cite: 49]. Les conditions peuvent être modifiées à tout moment[cite: 54].</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-primary dark:text-white mb-3">12. Droit applicable</h2>
            <p>Ces CGU sont régies par les lois de la République Gabonaise, avec compétence exclusive des tribunaux gabonais[cite: 57, 59].</p>
          </section>
        </div>
      </article>
    </div>
  );
}