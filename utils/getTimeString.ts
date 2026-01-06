export const getTimeString = (time: number): string => {
    return `${(time/1000).toFixed(3)}sec (${(time/60000).toFixed(2)}min)`
}
