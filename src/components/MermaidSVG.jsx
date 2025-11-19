import { ReactElement, createElement, useState, useEffect, useRef, elementUID} from "react";
import mermaid from "mermaid";
import elkLayouts from "@mermaid-js/layout-elk"

//Ideally this should be async but... React components cannot be async
//https://stackoverflow.com/questions/75689775/react-js-async-component
export function InitialSVG({ changeRecorder, action, markup, config = '{ "theme": "base"}', HTMLAttr = 'id', elementUID}) {
    console.info(`Executing component`);
    //create a state for the svg
    const [svg2, setSVG] = useState();
    // Zoom functionality
    const [zoomLevel, setZoomLevel] = useState(1);
    const MIN_ZOOM = 0.1;
    const MAX_ZOOM = 5;
    const ZOOM_STEP = 0.2;
    // Pan functionality
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const panRef = useRef({ x: 0, y: 0 });
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

    // Zoom control functions
    const handleZoomIn = () => {
        const newZoom = Math.min(zoomLevel + ZOOM_STEP, MAX_ZOOM);
        setZoomLevel(newZoom);
    };

    const handleZoomOut = () => {
        const newZoom = Math.max(zoomLevel - ZOOM_STEP, MIN_ZOOM);
        setZoomLevel(newZoom);
    };

    const handleResetZoom = () => {
        setZoomLevel(1);
        setPan({ x: 0, y: 0 });
        panRef.current = { x: 0, y: 0 };
    };

    // Pan functionality
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y });
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newPan = { x: e.clientX - dragStart.x, y: e.clientY - dragStart.y };
        setPan(newPan);
        panRef.current = newPan;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Wheel zoom functionality
    const handleWheel = (e) => {
        e.preventDefault();
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomLevel + delta));
        
        if (newZoom !== zoomLevel) {
            setZoomLevel(newZoom);
        }
    };

    // Mouse down wrapper for panning
    const handleMouseDownWrapper = (e) => {
        // Only start panning if not clicking on a clickable Mermaid element
        if (!e.target.closest('path, rect, circle, text, [data-clickable]')) {
            handleMouseDown(e);
        }
    };

    //after the component or svg2, run this:
    useEffect(() => {
        if (!svg2 || !containerRef.current) return;

        const container = containerRef.current;
        const listOfEventListeners = [];

        // Only add event listeners if elementUID is valid
        if (elementUID && elementUID !== 'N/A' && elementUID.trim() !== '') {
            console.info(`Filtering all elements with the filter ${elementUID} and attaching an event listener to the attribute, ${HTMLAttr}`);
            const rects = container.querySelectorAll(elementUID);

            rects.forEach((rect) => {
                const label = rect.getAttribute(HTMLAttr);
                console.info(`This is the label ${label}`);

                const handler = () => {
                    console.info(`Clicked ${label}!`);
                    action.canExecute ? action.execute() : "action not executable";
                    changeRecorder.setValue(label);
                };

                rect.addEventListener("click", handler);
                rect.style.cursor = 'pointer';
                listOfEventListeners.push({ node: rect, fn: handler });
            });
        }

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            listOfEventListeners.forEach(({ node, fn }) => {
                node.removeEventListener("click", fn);
            });
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [svg2, isDragging, dragStart, pan, elementUID, HTMLAttr]);

    if(!svg2) {
        console.info(`State is empty`);
        return <div>Rendering...</div>;
    }
    console.info(`State is good`);
    console.info(svg2);
    
    const transformStyle = {
        transform: `scale(${zoomLevel}) translate(${pan.x / zoomLevel}px, ${pan.y / zoomLevel}px)`
    };

    /*according to https://legacy.reactjs.org/docs/dom-elements.html?utm_source=chatgpt.com, it
    is better to use DangerouslySetInnerHTML as opposed to innerHTML to isolate vunerable codebases in the DOM. It is also
    faster than react-html-parser (https://www.dhiwise.com/post/how-to-use-react-dangerouslysetinnerhtml?utm_source=chatgpt.com)
    */
    //TODO: down the line, use external libraries to sanitize
    return (
        <div className="mermaid-graph-container" ref={containerRef}>
            <div className="mermaid-controls">
                <button
                    className="mermaid-control-btn"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= MAX_ZOOM}
                    title="Zoom In"
                >
                    +
                </button>
                <div className="mermaid-zoom-level">
                    {Math.round(zoomLevel * 100)}%
                </div>
                <button
                    className="mermaid-control-btn"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= MIN_ZOOM}
                    title="Zoom Out"
                >
                    −
                </button>
                <button
                    className="mermaid-control-btn"
                    onClick={handleResetZoom}
                    title="Reset Zoom"
                    style={{ fontSize: '12px' }}
                >
                    ⌂
                </button>
            </div>
            <div
                className="mermaid-zoom-container"
                onWheel={handleWheel}
                onMouseDown={handleMouseDownWrapper}
                style={transformStyle}
                data-zoomable-content
            >
                <div className="mermaid-content-wrapper" dangerouslySetInnerHTML={{ __html: svg2 }} />
            </div>
        </div>
    );
}