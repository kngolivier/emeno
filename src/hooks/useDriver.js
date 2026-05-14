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
  
  const isOnline = user?.driverState === "IDLE" || user?.driverState === "BUSY";
  const maxCapacity = user?.maxActiveDeliveries || 1;

  const refreshStats = useCallback(async () => {
    try {
      const response = await fetchMyStats("TODAY"); 
      console.log("STATS LIVREUR ====>  ", response)
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

  const toggleDuty = async () => {
    try {
      const nextStatus = !isOnline;
      const res = await driverApi.toggleAvailability(nextStatus);
      const updatedData = res.data?.data || res.data;
      
      updateUser({ ...user, driverState: updatedData.driverState });
      toast.success(nextStatus ? "Vous êtes en ligne" : "Vous êtes hors ligne");
    } catch (err) {
      toast.error("Erreur de statut : " + (err.response?.data?.message || err.message));
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
    refreshActiveOrders();
    refreshStats();
  }, [refreshActiveOrders, refreshStats]);

  return {
    activeOrders,
    stats,
    maxCapacity,
    loading,
    isOnline,
    toggleDuty,
    advanceStatus,
    validateDelivery,
    refreshActiveOrders,
    refreshStats
  };
};