import RNFS from "react-native-fs";
import axios from "axios";

const getJsonData = async () => {
    const path = `${RNFS.DocumentDirectoryPath}/data.json`;
    const jsonString = await RNFS.readFile(path, 'utf8');
    return JSON.parse(jsonString);
};

export const getBEData = async (): Promise<any> => {
    const api: string = "https://mock-backend-nest.cfapps.eu10-004.hana.ondemand.com/sync-lite";
    const path = `${RNFS.DocumentDirectoryPath}/data.json`;

    await RNFS.downloadFile({
        fromUrl: api,
        toFile: path,
    }).promise;

    return await getJsonData();
}

export const sendBEData = async (body: any): Promise<void> => {
        const api: string = "https://mock-backend-nest.cfapps.eu10-004.hana.ondemand.com/crud/1/1";
        try {
            const response = await axios.post(api, {
                params: {
                    entity: 'test',
                    id: 'Yauhen'
                },
                body,
            });
            console.log(response);
        } catch (error) {
            console.log(error)
        }
}