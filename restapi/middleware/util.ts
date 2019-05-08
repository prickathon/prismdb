export const sortInstanceList = (instanceList: object[], keysForSort: string[] = []) => {
    return instanceList.sort( (a, b) => {
        for(const key of keysForSort){
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }
        return 0;
    });
}