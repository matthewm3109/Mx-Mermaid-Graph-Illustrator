## Typical usage scenario
This widget uses the Mermaid framework to create interactive graphs and visualizations. Mermaid is an open-source Javascript-based charting tool that builds graphs based on a Markdown-based description. This widget can be used wherever you need graphing, though it is best utilized for more complex charts like:
- Flowcharts
- Gantt charts
- Entity–relationship diagrams
## Features and limitations
As of July 2nd 2025, this widget uses Mermaid version 10.2.4. To configure the widget, you need to pass in the following parameters: 

- Mermaid Markdown (String attribute) 
	- This is a Markdown-like syntax. It is recommended to test it out on Mermaid's live editor first. 
- UI Configuration (String attribute) 
	- Mermaid-specific styling as per Mermaid's theme configurator. Again, it is recommended to test it out on the live editor
- Selection (String attribute)
	- Attribute that is updated with a string upon clicking. Configuring this field ensures that your charts are interactive. 
- CSS Selector (String)
	- This string tells the browser what element(s) you're trying to select, using the same syntax you would in CSS
- HTML attribute (String) 
	- Attribute on the element (eg. id, x, y) that you want to retrieve the value from. This value will be populated in the Selection attribute (mentioned above) 
Though you can use this for real-time updates, the widget is not the most suited for very high-frequency events (<250ms) since the markdown input parameter needs to be re-built every time. 
## Dependencies
No dependencies. The widget will work OOTB. 
## Installation
Download the widget and add it to your page. The widget must be encapsulated in a helper entity. 
## Configuration
As mentioned above, the widget needs input parameters. To configure: 
- Create a helper entity
- Put the widget within a data view supplying aforementioned helper entity 
## Known bugs
There are no known bugs with the widget as of July 2nd 2025. Self-references in flowcharts are weirdly elongated, this is an issue with the Mermaid library. It was already noted by the Mermaid community and will hopefully be resolved. 

![WorkflowExample](https://github.com/user-attachments/assets/24180fac-d771-4f78-8a94-431c1e83a3fa)
![MindmapExample](https://github.com/user-attachments/assets/e0b8e20d-17cc-4f72-b7e7-c666941bf7db)
![GanttExample2](https://github.com/user-attachments/assets/02165eb3-9c72-46da-b57c-0d73329b23dc)
![GanttExample](https://github.com/user-attachments/assets/72e691e2-274e-4db8-8fd8-41b939ca59d5)
