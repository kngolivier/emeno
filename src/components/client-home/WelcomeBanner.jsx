import { Sparkles } from "lucide-react";

export default function WelcomeBanner({ user }) {
  return (
    <div className="mx-4 rounded-[2rem] bg-gradient-to-r from-primary to-secondary text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-80">Bonjour 👋</p>
          <h1 className="font-black text-3xl italic">{user?.nom}</h1>
          <p className="text-sm opacity-80 mt-2">Suivez vos colis et gérez vos livraisons.</p>
        </div>
        <Sparkles size={30} />
      </div>
    </div>
  );
}