import { API_URL } from "./config";

async function CheckOnline() {
    try{
        const resposta = await fetch(`${API_URL}/system/online`)
        if(resposta.ok){
        return true;
    }else{
        return false;
    }
    }catch(e){
        return false;
    }
}

export default CheckOnline;
