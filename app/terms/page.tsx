import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-bg-dark text-white flex flex-col items-center relative overflow-hidden py-20 px-6">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary-cyan/20 rounded-full blur-[120px] -z-10" />
      
      <div className="w-full max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-primary-cyan hover:text-white transition-colors mb-8 font-bold">
          <ChevronLeft size={20} />
          Retour à l'accueil
        </Link>
        
        <div className="glass-card p-8 md:p-12 text-text-secondary leading-relaxed space-y-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2">Conditions d'Utilisation</h1>
          <p className="text-sm uppercase tracking-wider text-primary-cyan font-bold">Dernière mise à jour : 31 Mai 2026</p>

          <p className="text-lg">
            Bienvenue sur <strong className="text-white">Pyramide Party</strong>. En téléchargeant ou en utilisant l'application, vous acceptez automatiquement ces conditions. Assurez-vous de les lire attentivement avant d'utiliser l'application.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">1. Licence d'utilisation</h2>
            <p>
              Pyramide Party vous accorde une licence personnelle, non exclusive, non transférable et révocable pour utiliser l'application à des fins personnelles et non commerciales, conformément aux présentes Conditions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">2. Règles de conduite</h2>
            <p className="mb-4">En utilisant notre application (notamment en multijoueur), vous acceptez de :</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ne pas utiliser de pseudos offensants, racistes, sexistes ou inappropriés.</li>
              <li>Ne pas tricher, hacker ou exploiter des bugs pour altérer l'expérience de jeu.</li>
              <li>Respecter les autres joueurs dans les salons en ligne.</li>
            </ul>
            <p className="mt-4 text-primary-pink font-bold">
              Tout non-respect de ces règles peut entraîner la suspension ou la suppression définitive de votre compte, sans préavis.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">3. Achats In-App</h2>
            <p>
              Pyramide Party propose des achats intégrés (monnaie virtuelle, cosmétiques). Tous les achats sont définitifs et non remboursables, sauf disposition contraire imposée par la loi ou par les plateformes (Apple App Store, Google Play Store).
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">4. Propriété Intellectuelle</h2>
            <p>
              Tous les droits, titres et intérêts concernant l'application (y compris les designs, logos, textes et codes) sont la propriété exclusive des créateurs de Pyramide Party. Il est strictement interdit de copier, modifier ou distribuer tout élément de l'application sans autorisation écrite.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white mb-4">5. Limitation de responsabilité</h2>
            <p>
              L'application est fournie "telle quelle". Nous ne garantissons pas que l'application sera exempte de bugs ou d'interruptions. Nous déclinons toute responsabilité en cas de perte de données (statistiques, progression) liée à un problème technique.
            </p>
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mt-12">
            <h2 className="text-2xl font-bold text-white mb-4">6. Nous contacter</h2>
            <p className="mb-4">Pour toute question concernant ces Conditions d'Utilisation, veuillez nous contacter :</p>
            <a href="mailto:contact@pyramideparty.fr" className="text-xl font-bold text-primary-cyan hover:underline">
              contact@pyramideparty.fr
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
