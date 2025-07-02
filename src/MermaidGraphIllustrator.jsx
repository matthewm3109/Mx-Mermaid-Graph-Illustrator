import { ReactElement, createElement, useState, useEffect, useRef} from "react";
import { InitialSVG} from "./components/MermaidSVG";
import "./ui/MermaidGraphIllustrator.css";

export function MermaidGraphIllustrator({ mermaidInfra, mermaidConfig, onClickAction, selection, CSSSelector, HTMLAttribute}) {

    const [mInfra, setmInfra] = useState();
    const [mConfig, setmConfig] = useState();
    //so as to not trigger refreshes 
    const CSSSelectorStr = useRef('');
    const HTMLAttributeStr = useRef('');

    //---------------------------------------------------------For Infra---------
    //define mInfra for the first time and whenever props change 
    useEffect(() => {
        if (mermaidInfra.value) {
            console.info(`Markup text has a value`)
            if (mermaidInfra !== undefined) {
                console.info(`Markup text is not undefined`)
                setmInfra(mermaidInfra.value.toString());
                setmConfig(mermaidConfig.value.toString());

                //is this really necessary? -> 

                if (CSSSelector) {CSSSelectorStr.current = CSSSelector;}
                else {CSSSelectorStr.current = 'N/A'}

                if (HTMLAttribute) {HTMLAttributeStr.current = HTMLAttribute;}
                else {HTMLAttributeStr.current = 'N/A'}

                console.info(`Markup text loaded again. Setting state as ${mInfra}`)
                console.info(`The HTML filter is ${CSSSelectorStr.current} and will be attaching an event listener to the attribute, ${HTMLAttributeStr.current}`);
                //render only when mInfra is defined  
            }
            else{
                setmInfra(undefined);
                console.info(`Markup text is set to be undefined`);
            }
        }
        else {
            console.warn(`Markup text has not loaded yet. Waiting...`)
            setmInfra(undefined);
        }
    }, [mermaidInfra, mermaidConfig, CSSSelector, HTMLAttribute]);

    //define mInfra reoccuring 
    /*
    useEffect(() => {
        if (mInfra !== undefined) {
            console.info(`Markup text is not undefined`)
            setmInfra(mInfra);
            console.info(`Markup text loaded again. Setting state as ${mInfra}`)
            //render only when mInfra is defined 

        }
    }, [mInfra]);
    */
    

    //render only when mInfra is defined 
    //splitting because hooks are only for "side effects", not rendering 
    if (mInfra !== undefined){
        try {
            console.info(`Before calling the component, the value of the input is ${mInfra}`)
            //const { x } = InitialSVG("test");
            return <div>
                <InitialSVG markup={mInfra} 
                config={mConfig} 
                action={onClickAction} 
                changeRecorder={selection} 
                elementUID={CSSSelectorStr.current}
                HTMLAttr={HTMLAttributeStr.current}
                />
                </div>
        }
        catch(error){
            return <div>
                <p>Error: {error}</p>
                </div>
        }
    }
    //While markup is still loading
    else {
        return <div>
                <p>Loading...</p>
                </div>
    }


}

