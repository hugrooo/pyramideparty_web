"use client";

import { useAuth } from "@/context/AuthContext";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { dbRT } from "@/lib/firebase";
import ProfileSetupModal from "./ProfileSetupModal";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setDataLoading(false);
      return;
    }

    const userRef = ref(dbRT, `users/${user.uid}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      setUserData(snapshot.val());
      setDataLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isLoading = authLoading || (user && dataLoading);
  const needsProfileSetup = user && !isLoading && (!userData || !userData.pseudo);

  return (
    <div className="flex min-h-screen bg-bg-dark">
      {needsProfileSetup ? (
        <ProfileSetupModal 
          uid={user.uid} 
          onComplete={() => {
            // It will automatically re-render when RTDB updates userData
          }} 
        />
      ) : (
        <>
          <Sidebar />
          {/* md:ml-64 pour la sidebar sur desktop, pb-24 sur mobile pour la BottomNav */}
          <main className={`flex-1 flex flex-col transition-all duration-300 pb-24 md:pb-0 ${user ? 'md:ml-64' : ''}`}>
            {children}
          </main>
        </>
      )}
    </div>
  );
}
