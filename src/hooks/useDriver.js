// FILE: src/hooks/useDriver.js

import { useState, useEffect, useCallback } from 'react';
import driverApi from '../api/driver.api';
import { fetchMyStats } from '../api/stats.api'; 
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const useDriver = () => {
  const { user, updateUser } = useAuth(); 
  const [activeOrders, setActiveOrders] = useState([]); 
  const [stats, setStats] = useState({ completed: 0, total: 0, distance: 0 }); 
  const [loading, setLoading] = useState(true);
  const [updatingState, setUpdatingState] = useState(false);

  // Un livreur est considéré "En ligne" globalement s'il n'est pas OFFLINE
  const isOnline = user?.driverState && user?.driverState !== "OFFLINE";
  // Un livreur est en pause uniquement si son état vaut explicitement "PAUSE"
  const isPaused = user?.driverState === "PAUSE";
  const maxCapacity = user?.maxActiveDeliveries || 1;

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetchMyStats("TODAY"); 
      setStats(response.data?.data || response.data);
    } catch (err) {
      console.error("Erreur stats livreur:", err.message);
    }
  }, []);

  const refreshActiveOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await driverApi.fetchActiveDeliveries();
      setActiveOrders(response?.data?.data || []); 
    } catch (err) {
      console.error("Erreur missions:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Déconnexion ou Connexion Globale
  const toggleDuty = async () => {
    if (updatingState) return;
    setUpdatingState(true);
    try {
      // Si en ligne (IDLE, PAUSE, BUSY), on passe OFFLINE, sinon on passe IDLE
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

  // Basculer l'état de pause (IDLE <-> PAUSE)
  const togglePause = async () => {
    if (!isOnline) {
      toast.error("Vous devez être en service pour prendre une pause");
      return;
    }
    if (user?.driverState === "BUSY") {
      toast.error("Impossible de prendre une pause pendant une livraison active");
      return;
    }
    if (updatingState) return;

    setUpdatingState(true);
    try {
      const nextState = isPaused ? "IDLE" : "PAUSE";
      const res = await driverApi.updateMyStateAction(nextState);
      const updatedData = res.data?.data || res.data;

      updateUser({ ...user, driverState: updatedData.driverState });
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
        toast.success(`Statut mis à jour : ${nextStatus}`);
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
    // On traque la géolocalisation uniquement si le livreur travaille et n'est pas déconnecté/en pause
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
  }, [refreshActiveOrders, refreshStats]);

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
    refreshStats
  };
};