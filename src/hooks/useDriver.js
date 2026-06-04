// FILE: src/hooks/useDriver.js

import { useState, useEffect, useCallback } from 'react';
import driverApi from '../api/driver.api';
import { fetchMyStats, fetchDriverLifetimeStats } from '../api/stats.api'; 
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const useDriver = () => {
  const { user, updateUser } = useAuth(); 
  const [activeOrders, setActiveOrders] = useState([]); 
  const [stats, setStats] = useState({ completed: 0, total: 0, distance: 0 }); 
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState(false);

  const status = {
    "ASSIGNED": "Assignée",
    "PICKED_UP": "Ramassée",
    "IN_PROGRESS": "En cours",
    "COMPLETED": "Terminée",
    "CANCELED": "Annulée"
  };

  // Un livreur est considéré "En ligne" globalement s'il n'est pas OFFLINE
  const isOnline = user?.driverState && user?.driverState !== "OFFLINE";
  // Un livreur est en pause uniquement si son état vaut explicitement "PAUSE"
  const isPaused = user?.driverState === "PAUSE";
  const maxCapacity = user?.maxActiveDeliveries || 1;

  // Ajoutez cet état dans useDriver
  const [lifetimeStats, setLifetimeStats] = useState({ completed: 0, total: 0, distance: 0, efficiency: 0 });

  // Ajoutez cette fonction
  const refreshLifetimeStats = useCallback(async () => {
    if (!user?._id) return;
    try {
      const response = await fetchDriverLifetimeStats(user._id); // Votre fonction API existante
      const data = response?.data?.data || response?.data; // S'adapter à la structure de votre réponse
      setLifetimeStats(data);
    } catch (err) {
      console.error("Erreur stats lifetime:", err);
    }
  }, [user?._id]);

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetchMyStats("TODAY");
      const statsData = response.data;
      
      if (statsData) {
        setStats({
          completed: Number(statsData.completed) || 0,
          total: Number(statsData.total) || 0,
          distance: Number(statsData.distance) || 0
        });
      }
    } catch (err) {
      console.error("Erreur d'extraction des stats livreur:", err.message);
    }
  }, []);

  const refreshActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await driverApi.fetchActiveDeliveries();
      const orders = response?.data?.data || [];
      setActiveOrders(orders); 

      // Synchronisation de l'état utilisateur global avec le nombre de courses en cours
      if (user && user.driverState !== "OFFLINE" && user.driverState !== "PAUSE") {
        const theoreticalState = orders.length >= maxCapacity ? "BUSY" : "IDLE";
        if (user.driverState !== theoreticalState) {
          updateUser({ ...user, driverState: theoreticalState });
        }
      }
    } catch (err) {
      console.error("Erreur missions:", err.message);
    } finally {
      setLoading(false);
    }
  }, [user, maxCapacity, updateUser]);

  // Déconnexion ou Connexion Globale
  const toggleDuty = async () => {
    if (updatingState) return;

    // 🛑 LOGIQUE MÉTIER : Interdiction stricte de se déconnecter s'il reste des commandes actives
    if (isOnline && activeOrders.length > 0) {
      toast.error(`Déconnexion impossible. Vous avez encore ${activeOrders.length} livraison(s) en cours à terminer.`);
      return;
    }

    setUpdatingState(true);
    try {
      const nextState = isOnline ? "OFFLINE" : "IDLE";
      const res = await driverApi.updateMyStateAction(nextState);
      const updatedData = res.data?.data || res.data;
      
      updateUser({ ...user, driverState: updatedData.driverState });
      toast.success(nextState === "IDLE" ? "Vous êtes en service" : "Vous êtes hors ligne");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de changement de service");
    } finally {
      setUpdatingState(false);
    }
  };

  // Basculer l'état de pause (IDLE/BUSY <-> PAUSE)
  const togglePause = async () => {
    if (!isOnline) {
      toast.error("Vous devez être en service pour prendre une pause");
      return;
    }
    if (updatingState) return;

    setUpdatingState(true);
    try {
      // 🚀 CORRECTION : On demande toujours "IDLE" ou "PAUSE". Le backend refuse "BUSY" par cette route.
      const nextState = isPaused ? "IDLE" : "PAUSE";

      const res = await driverApi.updateMyStateAction(nextState);
      const updatedData = res.data?.data || res.data;

      // On applique la réponse serveur propre
      let finalDriverState = updatedData.driverState;

      // Sécurité Front-end : Si le serveur renvoie IDLE mais qu'on sait qu'on a déjà des commandes au max,
      // on force localement l'état à BUSY en attendant le prochain cycle de rafraîchissement.
      if (finalDriverState === "IDLE" && activeOrders.length >= maxCapacity) {
        finalDriverState = "BUSY";
      }

      updateUser({ ...user, driverState: finalDriverState });
      toast.success(nextState === "PAUSE" ? "Pause enregistrée" : "Reprise du service active");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du changement de pause");
    } finally {
      setUpdatingState(false);
    }
  };

  const advanceStatus = async (order) => {
    if (!order) return;
    let nextStatus = "";
    if (order.status === 'ASSIGNED') nextStatus = 'PICKED_UP';
    else if (order.status === 'PICKED_UP') nextStatus = 'IN_PROGRESS';

    if (nextStatus) {
      try {
        const updated = await driverApi.updateDeliveryStatus(order._id, nextStatus);
        const updatedOrder = updated.data?.data || updated.data;
        setActiveOrders(prev => prev.map(o => o._id === order._id ? updatedOrder : o));
        toast.success(`Statut mis à jour : ${status[nextStatus] || nextStatus}`);
      } catch (err) {
        toast.error("Erreur de mise à jour");
      }
    }
  };

  const validateDelivery = async (id, code) => {
    try {
      await driverApi.validateDeliveryAction(id, code);
      setActiveOrders(prev => prev.filter(o => o._id !== id));
      toast.success("Livraison terminée !");
      refreshStats(); 
    } catch (err) {
      toast.error("Code de validation incorrect");
      throw err;
    }
  };

  useEffect(() => {
    let watchId;
    const shouldTrack = user?.driverState === "IDLE" || user?.driverState === "BUSY";
    if (shouldTrack && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          driverApi.updateDriverLocation(pos.coords.latitude, pos.coords.longitude, true);
        },
        (err) => console.warn("GPS Offline:", err),
        { enableHighAccuracy: true, distanceFilter: 50 }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [user?.driverState]);

  useEffect(() => {
    refreshActiveOrders();
    refreshStats();
    refreshLifetimeStats();
  }, [refreshActiveOrders, refreshStats, refreshLifetimeStats]);

  return {
    activeOrders,
    stats,
    maxCapacity,
    loading,
    isOnline,
    isPaused,
    updatingState,
    toggleDuty,
    togglePause,
    advanceStatus,
    validateDelivery,
    refreshActiveOrders,
    refreshStats,
    refreshLifetimeStats,
    lifetimeStats
  };
};