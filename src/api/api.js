import axios from "axios";

export const getSettings = async () => {
    try{
        const response = await axios.get(process.env.PUBLIC_URL + '/settings.json?' + new Date().getTime());
        const Whitelist = await axios.get(process.env.PUBLIC_URL + '/Whitelist.text?' + new Date().getTime());

        return {
            ...response.data,
            walletList: {
                Whitelist: Whitelist.data
            }
        }
    }catch(e){
        console.log(e);
    }
}