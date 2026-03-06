async function CheckOnline() {
    try{
        const resposta = await fetch('http://localhost:3000/system/online')
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