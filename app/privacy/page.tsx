import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-bg-dark text-white flex flex-col items-center relative overflow-hidden py-20 px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-purple/20 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-cyan hover:text-white transition-colors mb-8 font-bold">
          <ChevronLeft size={20} />
          Retour à l'accueil
        </Link>
        
        <div className="glass-card p-8 md:p-12 text-text-secondary leading-relaxed space-y-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Politique de Confidentialité</h1>
          <p className="text-sm uppercase tracking-wider text-primary-pink font-bold">Dernière mise à jour : 28 Mai 2026</p>

          <p className="text-lg">
            Bienvenue sur <strong className="text-white">Pyramide Party</strong>. Votre vie privée est une priorité pour nous. Cette Politique de Confidentialité explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application mobile.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Informations que nous collectons</h2>
            <p className="mb-4">Nous pouvons collecter les informations suivantes lors de votre utilisation de l'application :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-white">Données de profil :</strong> Lorsque vous vous connectez (via Apple, Google ou Email), nous collectons votre nom d'utilisateur et votre adresse e-mail.</li>
              <li><strong className="text-white">Données de jeu :</strong> Votre progression, niveau, statistiques de jeu (bluffs, pénalités) et monnaie virtuelle.</li>
              <li><strong className="text-white">Caméra :</strong> L'accès à la caméra est demandé uniquement en local pour scanner les QR codes permettant de rejoindre des salons de jeu en ligne. Aucune image n'est enregistrée ni transmise à nos serveurs.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. Utilisation de vos informations</h2>
            <p className="mb-4">Vos informations sont utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Créer et gérer votre compte.</li>
              <li>Sauvegarder votre progression et vos statistiques dans le Cloud.</li>
              <li>Permettre le multijoueur en temps réel avec d'autres joueurs.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Services Tiers</h2>
            <p className="mb-4">Nous utilisons des services tiers qui peuvent collecter des informations utilisées pour vous identifier :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><a href="https://firebase.google.com/policies/privacy" target="_blank" rel="noreferrer" className="text-primary-cyan hover:underline">Google Firebase (Authentification et Base de données)</a></li>
              <li><a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noreferrer" className="text-primary-cyan hover:underline">Apple (Connexion Sign In with Apple)</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sécurité des données</h2>
            <p>Nous utilisons des mesures de sécurité conformes aux standards de l'industrie (telles que le chiffrement fourni par Firebase) pour protéger vos informations personnelles.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Vos droits</h2>
            <p>Vous avez le droit de demander la suppression de votre compte et des données associées à tout moment depuis les paramètres de l'application (Bouton "Déconnexion" puis suppression sur demande).</p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact</h2>
            <p className="mb-4">Pour toute question, demande d'assistance (support) ou concernant cette politique de confidentialité, vous pouvez nous contacter directement à l'adresse e-mail suivante :</p>
            <a href="mailto:contact@pyramideparty.fr" className="text-xl font-bold text-primary-purple hover:underline">
              contact@pyramideparty.fr
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
