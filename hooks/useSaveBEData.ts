import {useCallback, useState} from "react";
import {sendBEData} from "@/utils";

type UseSaveBEDataProps= {
    saveOrdersOneByOneTime: number;
    saveOrdersParallelTime: number;
    saveOrdersOneByOne: () => Promise<void>;
    saveOrdersParallel: () => Promise<void>;
    resetSaveOrdersTimes: () => void;
}

export const useSaveBEData = (): UseSaveBEDataProps => {
    const [saveOrdersOneByOneTime, setSaveOrdersOneByOneTime] = useState<number>(0);
    const [saveOrdersParallelTime, setSaveOrdersParallelTime] = useState<number>(0);

    const saveOrdersOneByOne = useCallback(async (): Promise<void> => {
        setSaveOrdersOneByOneTime(0);
        const start: number = Date.now();
        for (let i: number = 0; i < 10; i++) {
            await sendBEData();
        }
        setSaveOrdersOneByOneTime(Date.now() - start);
    }, []);

    const saveOrdersParallel = useCallback(async (): Promise<void> => {
        setSaveOrdersParallelTime(0);
        const start: number = Date.now();
        const promises: any[] = [];
        for (let i: number = 0; i < 10; i++) {
            promises.push(sendBEData());
        }
        await Promise.all(promises);
        setSaveOrdersParallelTime(Date.now() - start);
    }, []);

    const resetSaveOrdersTimes = useCallback((): void => {
        setSaveOrdersOneByOneTime(0);
        setSaveOrdersParallelTime(0);
    }, []);

    return {
        saveOrdersOneByOneTime,
        saveOrdersParallelTime,
        saveOrdersOneByOne,
        saveOrdersParallel,
        resetSaveOrdersTimes,
    }
}
