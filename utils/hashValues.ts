import CryptoJS from "crypto-js";

const hashValue = (value: any): string => {
    return CryptoJS.SHA256(String(value)).toString(CryptoJS.enc.Hex);
};

export const hashValues = (BEData: any): void => {
    const orders: any[] = BEData.orders;
    const products: any[] = BEData.products;

    orders.forEach((order: any): void => {
        const hashedOrder: Record<string, any> = {};

        Object.keys(order).forEach((key: string): void => {
            const value: any = order[key];

            if (Array.isArray(value)) {
                hashedOrder[key] = [];

                value.forEach((item: any): void => {
                    const hashedItem: Record<string, any> = {};
                    Object.keys(item).forEach((itemKey: string): void => {
                        hashedItem[itemKey] = hashValue(item[itemKey]);
                    });
                    hashedOrder[key].push(hashedItem);
                });
            } else if (typeof value === 'object' && value !== null) {
                hashedOrder[key] = {};
                Object.keys(value).forEach((subKey: string): void => {
                    hashedOrder[key][subKey] = hashValue(value[subKey]);
                });
            } else {
                hashedOrder[key] = hashValue(value);
            }
        });
    });

    products.forEach((product: any): void => {
        const hashedProduct: Record<string, any> = {};

        Object.keys(product).forEach((key: string): void => {
            hashedProduct[key] = hashValue(product[key]);
        });
    });
};
