export const sortInstanceList = (instanceList: object[], keysForSort: string[]) => {
    return instanceList.sort( (a, b) => {
        for(const key of keysForSort){
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
        }
        return 0;
    });
}

export const filterInstanceList = (instanceList: object[], params:{[_:string]:string} = {}) => {
    let ret:object[] = [...instanceList] //deep copy
    console.log(params)
    Object.keys(params).forEach( key => {
        ret = ret.filter( instance => instance[key] === params[key] )
    })
    return ret
}