// FILE: src/hooks/useDriver.js

import { useState, useEffect, useCallback } from 'react';
import driverApi from '../api/driver.api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

export const useDriver = () => {
  // Remplacement de setUser par updateUser qui est exposé par AuthProvider
  const { user, updateUser } = useAuth(); 
  const [activeOrder, setActiveOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isOnline = user?.driverState === "IDLE" || user?.driverState === "BUSY";

  const refreshActiveOrder = useCallback(async () => {
    try {
      setLoading(true);
      const response = await driverApi.fetchActiveDeliveries();
      setActiveOrder(response?.data?.data[0] || null);
    } catch (err) {
      console.error("Erreur missions:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleDuty = async () => {
    try {
      const nextStatus = !isOnline;
      const res = await driverApi.toggleAvailability(nextStatus);
      
      const updatedData = res.data?.data || res.data;
      
      // Utilisation de updateUser pour mettre à jour le state ET le localStorage
      updateUser({ ...user, driverState: updatedData.driverState });
      
      toast.success(nextStatus ? "Vous êtes en ligne" : "Vous êtes hors ligne");
    } catch (err) {
      toast.error("Erreur de statut : " + (err.response?.data?.message || err.message));
    }
  };

  const advanceStatus = async () => {
    if (!activeOrder) return;
    let nextStatus = "";
    if (activeOrder.status === 'ASSIGNED') nextStatus = 'PICKED_UP';
    else if (activeOrder.status === 'PICKED_UP') nextStatus = 'IN_PROGRESS';

    if (nextStatus) {
      try {
        const updated = await driverApi.updateDeliveryStatus(activeOrder._id, nextStatus);
        setActiveOrder(updated.data?.data || updated.data);
        toast.success(`Statut : ${nextStatus}`);
      } catch (err) {
        toast.error("Erreur de mise à jour");
      }
    }
  };

  const validateDelivery = async (id, code) => {
    try {
      const response = await driverApi.validateDeliveryAction(id, code);
      setActiveOrder(null);
      
    //   const profile = await driverApi.fetchMyProfile();
    //   const freshUser = profile.data?.data || profile.data;
      
      // Mise à jour globale après livraison
    //   updateUser(freshUser);
      
      toast.success("Livraison terminée !");
      return response;
    } catch (err) {
      toast.error("Code de validation incorrect");
    }
  };

  useEffect(() => {
    let watchId;
    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          driverApi.updateDriverLocation(pos.coords.latitude, pos.coords.longitude, true);
        },
        (err) => console.warn("GPS Offline:", err),
        { enableHighAccuracy: true, distanceFilter: 50 }
      );
    }
    return () => navigator.geolocation.clearWatch(watchId);
  }, [isOnline]);

  useEffect(() => {
    refreshActiveOrder();
  }, [refreshActiveOrder]);

  return {
    activeOrder,
    loading,
    isOnline,
    toggleDuty,
    advanceStatus,
    validateDelivery,
    refreshActiveOrder
  };
};