import { useCallback, useState } from 'react';
import { trpc } from '@/sdk/client/trpc';

export function useManufacturing() {
  const [oeeData, setOeeData] = useState<any>(null);
  const [spcData, setSpcData] = useState<any>(null);
  const [maintenanceData, setMaintenanceData] = useState<any>(null);
  const [schedule, setSchedule] = useState<any>(null);

  const oeeMutation = trpc.manufacturing.calculateOEE.useMutation();
  const spcMutation = trpc.manufacturing.analyzeSPC.useMutation();
  const scheduleMutation = trpc.manufacturing.scheduleProduction.useMutation();
  const maintenanceMutation = trpc.manufacturing.predictMaintenance.useMutation();

  const loading = oeeMutation.isPending || spcMutation.isPending || scheduleMutation.isPending || maintenanceMutation.isPending;
  const error = oeeMutation.error?.message ?? spcMutation.error?.message ?? null;

  const calculateOEE = useCallback(async (machineId: string, availability: number, performance: number, quality: number) => {
    const result = await oeeMutation.mutateAsync({ machineId, availability, performance, quality });
    setOeeData(result);
    return result;
  }, [oeeMutation]);

  const analyzeSPC = useCallback(async (measurements: number[], sigmaLevel?: number, lsl?: number, usl?: number) => {
    const result = await spcMutation.mutateAsync({ measurements, sigmaLevel, lsl, usl });
    setSpcData(result);
    return result;
  }, [spcMutation]);

  const scheduleProduction = useCallback(async (
    orders: { orderId: string; quantity: number; priority: number; dueDate: string }[],
    machines: { machineId: string; productionRate: number; availability: number }[],
  ) => {
    const result = await scheduleMutation.mutateAsync({ orders, machines });
    setSchedule(result);
    return result;
  }, [scheduleMutation]);

  const predictMaintenance = useCallback(async (
    machineId: string,
    sensorData: { vibration: number; temperature: number; current: number; operatingHours: number },
  ) => {
    const result = await maintenanceMutation.mutateAsync({ machineId, sensorData });
    setMaintenanceData(result);
    return result;
  }, [maintenanceMutation]);

  return { oeeData, spcData, maintenanceData, schedule, loading, error, calculateOEE, analyzeSPC, scheduleProduction, predictMaintenance };
}
