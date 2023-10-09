import { useSnackbar } from 'notistack';
import  { useEffect, useState} from "react";


const useNotification = () => {
    const [conf, setConf] = useState({});
    const { enqueueSnackbar } = useSnackbar();
    const anchorOrigin = { horizontal: "right", vertical: "bottom" };

    useEffect(()=>{
        if(conf?.msg){
            let variant = 'info';
            if(conf.variant){
                variant = conf.variant;
            }
            enqueueSnackbar(conf.msg, {
                variant: variant,
                anchorOrigin
            });
        }
    },[conf]);
    return [conf, setConf];
};

export default useNotification;