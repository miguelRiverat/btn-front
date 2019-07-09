// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

/*
  Example usage of GraphView component
*/
import * as React from 'react';
import axios from 'axios';

import {
  GraphView,
  type IEdgeType as IEdge,
  type INodeType as INode,
  type LayoutEngineType,
} from '../';
import GraphConfig, {
  edgeTypes,
  EMPTY_EDGE_TYPE,
  EMPTY_TYPE,
  NODE_KEY,
  nodeTypes,
  POLY_TYPE,
  SPECIAL_CHILD_SUBTYPE,
  SPECIAL_EDGE_TYPE,
  SPECIAL_TYPE,
  SKINNY_TYPE,
} from './graph-config'; // Configures node/edge types

type IGraph = {
  nodes: INode[],
  edges: IEdge[],
};

type IDiagram  = {
  diagram: IGraph[]
};

// NOTE: Edges must have 'source' & 'target' attributes
// In a more realistic use case, the graph would probably originate
// elsewhere in the App or be generated from some other state upstream of this component.
const initGraph: IGraph = {
  id: Date.now(),
  title: new Date().toISOString(),
  edges: [],
  nodes: [],
};

const diagramaDataMin: IDiagram = [
    {
      id: Date.now(),
      title: new Date().toISOString()
    }
  ];

type IGraphProps = {};

type IGraphState = {
  graph: any,
  diagrams: any[],
  selected: any,
  copiedNode: any,
  layoutEngineType?: LayoutEngineType,
};

class Graph extends React.Component<IGraphProps, IGraphState> {
  GraphView;

  constructor(props: IGraphProps) {
    super(props);

    this.state = {
      graph: initGraph,
      selected: null,
      copiedNode: null,
      diagrams: diagramaDataMin,
      layoutEngineType: undefined,
      nodeInitial: null,
      nodeFinal : null,
      level: 0,
      pathResult: null,
    };

    this.GraphView = React.createRef();
  }

  // Helper to find the index of a given node
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex(edge => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  }

  // Given a nodeKey, return the corresponding node
  getViewNode(nodeKey: string) {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.graph.nodes[i];
  }
 
  getDiagrams = () => {
    const _this = this;

    axios.get('http://35.193.216.106/diagrams')
    .then(function (response) {
      _this.setState({ diagrams : response.data });
    }).catch(function (response) {  console.log(response); });
  };

  changeDiagram = (event) => {   
    for (var j = 0; j < this.state.diagrams.length; j++){
      if(event.target.value == this.state.diagrams[j]._id){
        console.log(this.state.diagrams[j]);
        this.setState({ graph : this.state.diagrams[j] });
      }
    }

    // Clean Nodes to calculate
    this.setState({ nodeInitial : null });
    this.setState({ nodeFinal : null });
  };

  newDiagram = () => {
    var newGraph: IGraph = {
      id: Date.now(),
      title: new Date().toISOString(),
      edges: [],
      nodes: [],
    };

    this.setState({ graph : newGraph });

    // Clean Nodes to calculate
    this.setState({ nodeInitial : null });
    this.setState({ nodeFinal : null });
  };

  saveorUpdateDiagram = () => {
    const _this = this;

    if(this.state.graph._id){ // Actualizar grafo existente
      this.updateDiagram().then((idResponse) => {
        console.log("El diagrama se actualizó correctamente ----- " + idResponse);
        alert("El diagrama se actualizó correctamente")
      }).catch(err => console.log("Error al actualizar el Diagrama: ", err));
    }else{ // Guardar nuevo grafo
      this.saveDiagram().then((idResponse) => {
        console.log("El diagrama se guardo correctamente ----- " + idResponse);
        alert("El diagrama se guardó correctamente")
      }).catch(err => console.log("Error al guardar el Diagrama: ", err));
    }
  };

  deleteDiagram = () => {
    const _this = this;

    if(this.state.graph._id){ // Actualizar grafo existente
      axios.delete('http://35.193.216.106/diagrams/'+this.state.graph._id)
      .then(function (response) {
        console.log(response);
        _this.getDiagrams();
        _this.newDiagram();
      })
      .catch(function (error) {
        console.log(error);
      });
    }else{ // Guardar nuevo grafo
      alert('No se puede borrar este elemento');
    }

  };

  selectNodeInitial = (event) => {
    this.setState({ nodeInitial : event.target.value });
  };

  selectNodeFinal = (event) => {
    this.setState({ nodeFinal : event.target.value });
  };

  updateDiagram () {
    const _this = this;
    return axios.put('http://35.193.216.106/diagrams/'+this.state.graph._id, this.state.graph)
    .then((response) => {
      _this.getDiagrams(); // Actualizar Diagrama
      return response.data._id;
    });
  };

  saveDiagram () {
    const _this = this;
    return axios.post('http://35.193.216.106/diagrams', this.state.graph)
    .then((response) => {
      this.setState({ graph : response.data });
      _this.getDiagrams(); // Guardar Diagrama
      return response.data._id;
    });
  };

  calculateDijkstra (id) {
    const _this = this;

    var data = {
      startNode: this.state.nodeInitial,
      endNode: this.state.nodeFinal,
      level: this.state.level
    };

    return axios.post('http://35.193.216.106/dijkstra/'+ id, data)
    .then((response) => {
      if(response && response.data.path){
        console.log('**** ' + JSON.stringify(response.data.path));
        _this.setState({ pathResult : JSON.stringify(response.data.path) });
        return response.data;
      }else{
        _this.setState({ pathResult : '["No existe ruta entre esos nodos!!"]' });
        return " No existe la ruta";
      }
    });
  };

  calculatePath = () => {
    console.log('**** calculateDijkstra');
    const _this = this;
    
    if(this.state.nodeInitial && this.state.nodeFinal && this.state.nodeInitial !== this.state.nodeFinal){
      if(this.state.graph._id){ // Actualizar grafo existente
        this.updateDiagram().then((idResponse) => {
          console.log(" ----- " + idResponse );
          _this.calculateDijkstra(idResponse).then((response) => {
            console.log("El diagrama se calculó correctamente ----- " + JSON.stringify(response));
          }).catch(err => console.log("Error al calcular el Diagrama: ", err));    
        }).catch(err => console.log("Error al actualizar el Diagrama: ", err));
      }else{ // Guardar nuevo grafo
        this.saveDiagram().then((idResponse) => {
          console.log(" ----- " + idResponse );
          _this.calculateDijkstra(idResponse).then((response) => {
            console.log("El diagrama se calculó correctamente ----- " + JSON.stringify(response));
          }).catch(err => console.log("Error al calcular el Diagrama: ", err));
        }).catch(err => console.log("Error al guardar el Diagrama: ", err));
      }
    }else{ // Guardar nuevo grafo
      alert('No se puede realizar el recorrido con estos nodos');
    }
  };

  handleChangeLevel = (event: any) => {
    this.setState({ level: parseInt(event.target.value) });
  };


  // Called by 'drag' handler, etc..
  // to sync updates from D3 with the graph
  onUpdateNode = (viewNode: INode) => {
    const graph = this.state.graph;
    const i = this.getNodeIndex(viewNode);

    graph.nodes[i] = viewNode;
    this.setState({ graph });
  };

  // Node 'mouseUp' handler
  onSelectNode = (viewNode: INode | null) => {
    // Deselect events will send Null viewNode
    this.setState({ selected: viewNode });
  };

  // Edge 'mouseUp' handler
  onSelectEdge = (viewEdge: IEdge) => {
    this.setState({ selected: viewEdge });
  };

  // Updates the graph with a new node
  onCreateNode = (x: number, y: number) => {
    const graph = this.state.graph;

    // This is just an example - any sort of logic
    // could be used here to determine node type
    // There is also support for subtypes. (see 'sample' above)
    // The subtype geometry will underlay the 'type' geometry for a node
    //const type = Math.random() < 0.25 ? SPECIAL_TYPE : EMPTY_TYPE;
    const type = EMPTY_TYPE;

    const viewNode = {
      id: Date.now(),
      title: Date.now(),
      type,
      x,
      y,
    };

    graph.nodes = [...graph.nodes, viewNode];
    this.setState({ graph });
  };

  // Deletes a node from the graph
  onDeleteNode = (viewNode: INode, nodeId: string, nodeArr: INode[]) => {
    const graph = this.state.graph;
    // Delete any connected edges
    const newEdges = graph.edges.filter((edge, i) => {
      return (
        edge.source !== viewNode[NODE_KEY] && edge.target !== viewNode[NODE_KEY]
      );
    });

    graph.nodes = nodeArr;
    graph.edges = newEdges;

    this.setState({ graph, selected: null });
  };

  // Creates a new node between two edges
  onCreateEdge = (sourceViewNode: INode, targetViewNode: INode) => {
    const graph = this.state.graph;
    // This is just an example - any sort of logic
    // could be used here to determine edge type
    const type = sourceViewNode.type === SPECIAL_TYPE ? SPECIAL_EDGE_TYPE : EMPTY_EDGE_TYPE;

    const viewEdge = {
      source: sourceViewNode[NODE_KEY],
      target: targetViewNode[NODE_KEY],
      type,
    };

    // Only add the edge when the source node is not the same as the target
    if (viewEdge.source !== viewEdge.target) {
      graph.edges = [...graph.edges, viewEdge];
      this.setState({
        graph,
        selected: viewEdge,
      });
    }
  };

  // Called when an edge is reattached to a different target.
  onSwapEdge = (
    sourceViewNode: INode,
    targetViewNode: INode,
    viewEdge: IEdge
  ) => {
    const graph = this.state.graph;
    const i = this.getEdgeIndex(viewEdge);
    const edge = JSON.parse(JSON.stringify(graph.edges[i]));

    edge.source = sourceViewNode[NODE_KEY];
    edge.target = targetViewNode[NODE_KEY];
    graph.edges[i] = edge;
    // reassign the array reference if you want the graph to re-render a swapped edge
    graph.edges = [...graph.edges];

    this.setState({
      graph,
      selected: edge,
    });
  };

  // Called when an edge is deleted
  onDeleteEdge = (viewEdge: IEdge, edges: IEdge[]) => {
    const graph = this.state.graph;

    graph.edges = edges;
    this.setState({
      graph,
      selected: null,
    });
  };

  onCopySelected = () => {
    if (this.state.selected.source) {
      console.warn('Cannot copy selected edges, try selecting a node instead.');
      return;
    }

    const x = this.state.selected.x + 10;
    const y = this.state.selected.y + 10;

    this.setState({
      copiedNode: { ...this.state.selected, x, y },
    });
  };

  onPasteSelected = () => {
    if (!this.state.copiedNode) {
      console.warn('No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C');
    }

    const graph = this.state.graph;
    const newNode = { ...this.state.copiedNode, id: Date.now() };

    graph.nodes = [...graph.nodes, newNode];
    this.forceUpdate();
  };

  componentWillMount(){
    this.getDiagrams();
  }

  render() {
    const { nodes, edges } = this.state.graph;
    const { diagrams } = this.state;
    const selected = this.state.selected;
    const { NodeTypes, NodeSubtypes, EdgeTypes } = GraphConfig;
    const pathResult = this.state.pathResult;

    var cbxDiagrams = <select className="diagram-cmbx"></select>;
    if (diagrams.length > 0) {
      cbxDiagrams =
        <select onChange={this.changeDiagram} className="diagram-cmbx">
          <option key={null} value={null}></option>
          {
            diagrams.map((item, key) => (
              <option key={item._id} value={item._id}> {item.title}</option>
            ))
          }
        </select>;
    }

    var cbxNodoInitial = <select className="comboSize"></select>;
    if(nodes.length > 0){
      cbxNodoInitial = 
        <select onChange={this.selectNodeInitial} >
          <option key={null} value={null}></option>
          {
            nodes.map((item, key) => (
              <option key={item.id} value={item.id}> {item.id}</option>
            ))
          }
        </select>;
    }

    var cbxNodoFinal = <select className="comboSize"></select>;
    if(nodes.length > 0){
      cbxNodoFinal = 
        <select onChange={this.selectNodeFinal} >
          <option key={null} value={null}></option>
          {
            nodes.map((item, key) => (
              <option key={item.id} value={item.id}> {item.id}</option>
            ))
          }
        </select>;
    }

    if(pathResult){
      var listItems = //<li></li>;
      JSON.parse(pathResult).map((res) =>
        <li>{res}</li>
      );
    }

    return (
      <div id="graph">
        <div className="graph-flex">
          <div className="graph-header">
            <div className="element-display">
              <span>Cargar:</span>{cbxDiagrams}
            </div>
            <button onClick={this.saveorUpdateDiagram}>Guardar</button>
            <button onClick={this.deleteDiagram}>Borrar</button>
            <button onClick={this.newDiagram}>Nuevo</button>
          </div>
          <div className="graph-path">
            <div className="element-display">
              <span>Inicial:</span>{cbxNodoInitial}
            </div>
            <div className="element-display">
              <span>Final: </span>{cbxNodoFinal}
            </div>
            <div className="element-display">
              <span>Nivel:  </span>
              <input className="level-cmbx" type="number" onBlur={this.handleChangeLevel} placeholder="0"/>
              <button onClick={this.calculatePath}>Calcular</button>
            </div>
          </div>
          <div className="graph-path-result">
            <span>Recorrido:</span>
            <ul className="list">{listItems}</ul>
          </div>
        </div>
        <GraphView
          ref={el => (this.GraphView = el)}
          nodeKey={NODE_KEY}
          nodes={nodes}
          edges={edges}
          diagrams={diagrams}
          selected={selected}
          pathResult={pathResult}
          nodeTypes={NodeTypes}
          nodeSubtypes={NodeSubtypes}
          edgeTypes={EdgeTypes}
          onSelectNode={this.onSelectNode}
          onCreateNode={this.onCreateNode}
          onUpdateNode={this.onUpdateNode}
          onDeleteNode={this.onDeleteNode}
          onSelectEdge={this.onSelectEdge}
          onCreateEdge={this.onCreateEdge}
          onSwapEdge={this.onSwapEdge}
          onDeleteEdge={this.onDeleteEdge}
          onUndo={this.onUndo}
          onCopySelected={this.onCopySelected}
          onPasteSelected={this.onPasteSelected}
          layoutEngineType={this.state.layoutEngineType}
        />
      </div>
    );
  }
}

export default Graph;
