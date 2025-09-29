
const STORAGE_KEY='interview_data';

export const saveToStorage=(data:any)=>{
    try{
        localStorage.setItem(STORAGE_KEY,JSON.stringify(data));
    }catch(error){
            console.error('Error Saving to localStorage',error);
    }
}


export const loadFromStorage=()=>{
    try{
        const data=localStorage.getItem(STORAGE_KEY);
        return data?JSON.parse(data):null;
    }catch(error){
        console.log('Error loading from localStorage',error);
        return null;
    }
};

export const clearStorage=()=>{
    localStorage.removeItem(STORAGE_KEY);
}