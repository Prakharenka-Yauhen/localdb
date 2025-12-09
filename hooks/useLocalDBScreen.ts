import {useCallback} from "react";

type UseLocalDBScreenProps = {
    getDBData: () => void;
    writeDBData: () => void;
    updateDBData: () => void;
    deleteDBData: () => void;
}

export const useLocalDBScreen = (): UseLocalDBScreenProps => {
    const getDBData = useCallback(() => {}, []);
    const writeDBData = useCallback(() => {}, []);
    const updateDBData = useCallback(() => {}, []);
    const deleteDBData = useCallback(() => {}, []);

    return {getDBData, writeDBData, updateDBData, deleteDBData}
}