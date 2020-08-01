export type KeyValue = { [key: string]: any; }

export const sortInstanceList = (instanceList: KeyValue[], keysForSort: string[]) => {
    return instanceList.sort( (a, b) => {
        for(const key of keysForSort){
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }
        return 0;
    });
}

export const filterInstanceList = (instanceList: KeyValue[], params:KeyValue = {}) => {
    let ret:KeyValue[] = [...instanceList] //deep copy
    console.log(params)
    Object.keys(params).forEach( key => {
        ret = ret.filter( instance => instance[key].toString() === params[key] )
    })
    return ret
}