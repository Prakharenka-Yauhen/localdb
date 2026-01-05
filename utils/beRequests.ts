import {Alert} from "react-native";
import RNFS from "react-native-fs";
import axios from "axios";

const FILE_PATH = `${RNFS.DocumentDirectoryPath}/data.json`;
const LARGE_FILE_PATH = `${RNFS.DocumentDirectoryPath}/data.json`;

const URL: string = "https://mock-backend-nest.cfapps.eu10-004.hana.ondemand.com";
const FILE_API: string = `${URL}/sync-lite`;
const LARGE_FILE_API: string = `${URL}/sync`;
const SEND_API: string = `${URL}/crud/test/Yauhen`;

export const readRNFSData = async (chunkSize: number, position: number): Promise<any> => {
    try {
        return  await RNFS.read(LARGE_FILE_PATH, chunkSize, position, 'utf8');
    } catch (e: unknown) {
        Alert.alert('Error read RNFS data', JSON.stringify(e));
    }
};

const getJsonData = async (): Promise<any> => {
    try {
        const jsonString: string = await RNFS.readFile(FILE_PATH, 'utf8');
        return JSON.parse(jsonString);
    } catch (e: unknown) {
        Alert.alert('Error parsing BE data', JSON.stringify(e));
    }
};

const getJsonChunksData = async (): Promise<any> => {
    try {
        return await RNFS.stat(LARGE_FILE_PATH);
    } catch (e: unknown) {
        Alert.alert('Error parsing large BE data', JSON.stringify(e));
    }
};

export const getBEData = async (): Promise<any> => {
    try {
        await RNFS.downloadFile({
            fromUrl: FILE_API,
            toFile: FILE_PATH,
        }).promise;

        return await getJsonData();
    } catch (e: unknown) {
        Alert.alert('Error downloading BE data', JSON.stringify(e));
    }
}

export const getBELargeData = async (): Promise<any> => {
    try {
        await RNFS.downloadFile({
            fromUrl: LARGE_FILE_API,
            toFile: LARGE_FILE_PATH,
        }).promise;

        return await getJsonChunksData();
    } catch (e: unknown) {
        Alert.alert('Error downloading BE large data', JSON.stringify(e));
    }
}

export const sendBEData = async (): Promise<void> => {
        const mockBody =  {
            "order_id": "ORD-146afbe8-e072-4475-b493-d800446f671e",
            "created_at": "2025-09-22",
            "contact_id": "Devin_Johnston",
            "contract_id": "CA-eff3b56e-160a-4654-85e1-3ede21c4d527",
            "contacts": [
                {
                    "full_name": "Devin Johnston",
                    "email": "devin.johnston@hilll llc.com",
                    "phone": "(481) 827-9467",
                    "company": "Hilll LLC"
                },
                {
                    "full_name": "Rudolf Bechtelar",
                    "email": "rudolf.bechtelar@ullrich-kemmer.com",
                    "phone": "460-148-8180",
                    "company": "Ullrich-Kemmer"
                }
            ],
            "products_orders": [
                {
                    "product_id": "product_1",
                    "price": 1087.9,
                    "quantity": 1950
                },
                {
                    "product_id": "product_2",
                    "price": 387.55,
                    "quantity": 1919
                }
            ],
            "contract_agreement": {
                "contract_id": "CA-eff3b56e-160a-4654-85e1-3ede21c4d527",
                "title": "Service Agreement",
                "signed_date": "2025-06-01"
            }
        }

        try {
            await axios.post(SEND_API, {
                body: JSON.stringify(mockBody),
            });
        } catch (error) {
            Alert.alert('Error sending BE data', JSON.stringify(error));
        }
}
