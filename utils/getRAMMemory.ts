import DeviceInfo from "react-native-device-info";

export const getRAMMemory = async (): Promise<string> => {
    const usedMemory: number = await DeviceInfo.getUsedMemory();
    const usedMemoryMB = usedMemory / 1024 / 1024;
    return usedMemoryMB.toFixed(2);
}