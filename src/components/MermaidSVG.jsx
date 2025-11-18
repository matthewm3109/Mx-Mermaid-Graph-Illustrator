import { ReactElement, createElement, useState, useEffect, useRef, elementUID} from "react";
import mermaid from "mermaid";
import elkLayouts from "@mermaid-js/layout-elk"

//Ideally this should be async but... React components cannot be async
//https://stackoverflow.com/questions/75689775/react-js-async-component
export function InitialSVG({ changeRecorder, action, markup, config = '{ "theme": "base"}', HTMLAttr = 'id', elementUID}) {
    console.info(`Executing component`);
    //create a state for the svg 
    const [svg2, setSVG] = useState();
    //register the SVG 
    const containerRef = useRef(null);
    //create an async function that tracks changes on an empty dependency array(?!)
    
    useEffect(() => {
        console.info(`Executing code within async function`);
        /*use this for testing*/
        //const graphDefinition = 'graph TB\na-->b'; 
        const renderMermaid = async () => {
            try {
                const JSONConfig = config;
                const parsedConfig = JSON.parse(JSONConfig);
                // register ELK
                mermaid.registerLayoutLoaders(elkLayouts)
                mermaid.initialize({
                    parsedConfig
                });
                const  { svg } = await mermaid.render('graphDiv', markup);
                console.debug(`SVG: ${svg}`);
                setSVG(svg);
                console.debug(`Updated state: ${svg2}`);

            }
            catch(error){
                console.warn(`Error in renderMermaid: ${error}`);
                setSVG(`<p>Error: ${error.message}</p>`);
            }
        }
        renderMermaid();
    },[markup , config]);

    //after the component or svg2, run this: 
    useEffect(() => {
        if (!svg2 || !containerRef.current) return;

        const container = containerRef.current;
        console.info(`Filtering all elements with the filter ${elementUID} and attaching an event listener to the attribute, ${HTMLAttr}`);
        const rects = container.querySelectorAll(elementUID);

        const listOfEventListeners = [];

        rects.forEach((rect) => {
            const label = rect.getAttribute(HTMLAttr);
            console.info(`This is the label ${label}`);

            const handler = () => {
                console.info(`Clicked ${label}!`);
                action.canExecute ? action.execute() : "action not executable";
                changeRecorder.setValue(label);
                //changeRecorder.setValue('Test');
            };

            rect.addEventListener("click", handler);
            rect.style.cursor = 'pointer'; //fix (6/27/2025)
            listOfEventListeners.push({ node: rect, fn: handler });
        });

        return () => {
            listOfEventListeners.forEach(({ node, fn }) => {
                node.removeEventListener("click", fn);
            });
        };
    }, [svg2]);
    


    if(!svg2) {
        console.info(`State is empty`);
        return <div>Rendering...</div>;
    }
    console.info(`State is good`);
    console.info(svg2);
    /*according to https://legacy.reactjs.org/docs/dom-elements.html?utm_source=chatgpt.com, it 
    is better to use DangerouslySetInnerHTML as opposed to innerHTML to isolate vunerable codebases in the DOM. It is also 
    faster than react-html-parser (https://www.dhiwise.com/post/how-to-use-react-dangerouslysetinnerhtml?utm_source=chatgpt.com)
    */
    //TODO: down the line, use external libraries to sanitize
    return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: svg2 }} />;
}