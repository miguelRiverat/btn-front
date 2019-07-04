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
const sample: IGraph = {
  edges: [
    /*
    {
      handleText: 'Nivel 5',
      source: 'start1',
      target: 'a1',
      type: SPECIAL_EDGE_TYPE,
    },
    */
  ],
  nodes: [
    /*
    {
      id: 'a1',
      title: 'Node A (1)',
      type: SPECIAL_TYPE,
      x: 258.3976135253906,
      y: 331.9783248901367,
    },
    */
  ],
};

const diagramaData: IDiagram = {
  diagrams: [
    {
      id: 1,
      title: 'Diagrama 1',
      edges: [
        {
          handleText: 'Nivel 5',
          source: 'start1',
          target: 'a1',
          type: SPECIAL_EDGE_TYPE,
        },
      ],
      nodes: [
        {
          id: 'a1',
          title: 'Node A (1)',
          type: SPECIAL_TYPE,
          x: 258.3976135253906,
          y: 331.9783248901367,
        },
      ]
    },
    {
      id: 2,
      title: 'Diagrama 2',
      edges: [
        {
          handleText: 'Nivel 5',
          source: 'start1',
          target: 'a1',
          type: SPECIAL_EDGE_TYPE,
        },
      ],
      nodes: [
        {
          id: 'a1',
          title: 'Node A (1)',
          type: SPECIAL_TYPE,
          x: 258.3976135253906,
          y: 331.9783248901367,
        },
      ]
    },
    {
      id: 3,
      title: 'Diagrama 3',
      edges: [
        {
          handleText: 'Ruta 1',
          source: 'a0',
          target: 'a1',
          type: SPECIAL_EDGE_TYPE,
        },
      ],
      nodes: [
        {
          id: 'a0',
          title: 'Nodo (0)',
          type: SPECIAL_TYPE,
          x: 258.3976135253906,
          y: 331.9783248901367,
        },
        {
          id: 'a1',
          title: 'Nodo (1)',
          type: SPECIAL_TYPE,
          x: 268.3976135253906,
          y: 331.9783248901367,
        },
      ]
    }
  ]
};

const diagramaDataMin: IDiagram = [
    {
      id: 1,
      title: 'Diagrama 1'
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
      graph: sample,
      selected: null,
      copiedNode: null,
      diagrams: diagramaDataMin,
      layoutEngineType: undefined,
    };

    this.GraphView = React.createRef();
  }

  // Helper to find the index of a given node
  /*
  getNodeIndex(searchNode: INode | any) {
    return this.state.graph.nodes.findIndex(node => {
      return node[NODE_KEY] === searchNode[NODE_KEY];
    });
  }
 */

  // Helper to find the index of a given edge
  getEdgeIndex(searchEdge: IEdge) {
    return this.state.graph.edges.findIndex(edge => {
      return (
        edge.source === searchEdge.source && edge.target === searchEdge.target
      );
    });
  }

  // Given a nodeKey, return the corresponding node
  /*
  getViewNode(nodeKey: string) {
    const searchNode = {};
    searchNode[NODE_KEY] = nodeKey;
    const i = this.getNodeIndex(searchNode);
    return this.state.graph.nodes[i];
  }
 */

  getDiagrams = () => {
    console.log('**** getDiagrams');
    const _this = this;

    axios.get('http://34.67.133.106/diagrams')
    //axios.get('https://00e9e64bacc0960e8638650447f1c795bda41db35d9985f010-apidata.googleusercontent.com/download/storage/v1/b/banorte_poc/o/diagrams.json?qk=AD5uMEty7q0nFouhBac7WawDIgFMtClvEj3eVd2FgG_8RBe7tdm6hF-NOjTkxZPm4HWuu6OPB7dfdQ565LxoPjS9HEbOxp0uPnTbWZmOe0PA3jaQApIm0cEbpeIB9mZ1mrEoQI-FoOZ6pGsOlKVgc9dI3eM9JjO8gDc3ooI1dbTvtD6HpiK4khZnihp_go0tzjT4zzkI802R9INyaYG6qrBdQ9N2dnKoOVyaAwbbgPLx32jgBcdWhoHlhnpkWzxT_879gtCiytjp7eT6bnXweANfOdOvsIj-BL7RXBYrPlb_TiChnIiNKAzTs2y03Z5FI7laZYdqBZvXr8wBl_bpfomM1n24lISfJg9_wwS8JAMfBu-Ary6pqh2sjOx3ksncd53d_SePT42x3XSuagXQAaJJY43IQh4UY0yNkn7OzV0uityctrELBxmE5pp9MPnFxECfftLrzL7a67wDqD9VYiNkOWJvcqWLF7HKPw6V9nHZRnuXlPuoLOJfB-s6bNsgCAHqHhpTGbH9qbMkectd4VFRLCGqaJqjV279DVotdSdw97FIHaqfIdQrFxsciMcK-WP0owhUWBrtW3XC7v8a9IvMyNddbgOp0KRs516EMefB44f5HYd81aFiJ6CrlTSlgGrILv2MI1k6ru6D02X-8aSsMYfXHrP1mq5_ihijz9QX7J7DeqHTinos2vAGzhRyGzg9wCUdLFpo65sV_V1MKjBCK-slRwshmOsLIz1k4tSm4MQsgzi_R533txcs9SXy2KFIDdNOg0m6')
    .then(function (response) {
      _this.setState({ diagrams : response.data });
    })
    .catch(function (response) {
      console.log(response);
    });
  };

  changeDiagram = (event) => {   
    for (var j = 0; j < this.state.diagrams.length; j++){
      if(event.target.value == this.state.diagrams[j].id){
        console.log(this.state.diagrams[j]);
        this.setState({ graph : this.state.diagrams[j] });
      }
    }
      
    //this.state.diagrams.map((item, key) => (
    //  console.log(" ++++++ " + item.id)
      //<option key={item.id} value={item.id}> {item.title}</option>
    //));


    //var diagrams = JSON.parse(this.state.diagrams);
    //console.log(" ***** Diagrams: " + diagrams);

    /*diagrams.forEach(function(element) {
      console.log(element);
    });*/

  };

  saveDiagram = () => {
    console.log('**** saveDiagram: ' + JSON.stringify(this.state.graph));
    axios.get('https://00e9e64bac454879ad2b3f147b7ef2a9302b66ec323c8bd380-apidata.googleusercontent.com/download/storage/v1/b/banorte_poc/o/diagrams.json?qk=AD5uMEu-OX1YxJTFRpkJ5jF9oGNTxGoVZZWvaTVCIrEYvCv6XaT-TTu2-JiYRWeha4tv5QCsr7ledif5pmZQz8wSk_RIU1m4oO1idJhLuK2EbdXvIeExRZq81P-qTzMuGSIe3cBu9l-9f2131cns54fpgJzuUUNQEtwA9e7M-syG54sfQI0xkDdgi3DaxPAUcYxv7kLMjS7mQMSQiTIRNt1PVCOYTg_HeB8hNnJGCPIo2Z9Tiyk9WQCjunauCyXggbTaw3DPXcCzBboBdsbD-L58dZhNZZtJXqZt6kgvvdBRT4K0bnURj5Zg2G88IJsJf6M_7oMpNRkExaMhmJS9vNLL27Y1mhrQ2FxVxyz9s016gcEwn_XuE5lX1hHM5cL75EpCjy9DDgJBkiG0tviDXBHPC84x3k2fTL0OxaS-q7mDiSYlwQFlRDXmbDzap33oKTqHtZYpGfLtNCKvw7okBcGJpvrIhNPSykoHw2WNoYcGOEw4fhzEFN27tjGTf83JYEixFiqv77okMBITh-rVS_HvyudXuRul0Tu01GDpkgB5rqSE0noL5-JhiNNpP2uyb4yRVyMODn2hohMpsQogQn3Xj5gfRDxiIqAg_U9GJq2pIr5BL7ruDEK_a8aVIb1aRCj-6OjG0tk600EM-CBhX9R1XhXYfA7ZIUvdXel-NHBJ6D59bJ2vkzINvojeTQVHLhw33d6FKhspKbkQsQbQKQgI_jljOBBAU9lDKITKaIl_-qvXcCncxdBXQrHsWRjMhaiDwHZVqJO_')
    .then(function (response) {
      console.log(response);
    })
    .catch(function (response) {
      console.log(response);
    });
  };

  calculateDijkstra = () => {
    console.log('**** calculateDijkstra');
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
      title: '',
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
      console.warn(
        'No node is currently in the copy queue. Try selecting a node and copying it with Ctrl/Command-C'
      );
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

    var cbxDiagrams = <select></select>;

    if (diagrams) {
      cbxDiagrams =
        <select onChange={this.changeDiagram} >
          {
            diagrams.map((item, key) => (
              <option key={item.id} value={item.id}> {item.title}</option>
            ))
          }
        </select>;
    }

    return (
      <div id="graph">
        <div className="graph-header">
          <input type="text" className="total-nodes" onBlur={this.handleChange} placeholder={'Nombre del Diagrama'}/>
          <button onClick={this.saveDiagram}>Guardar</button>
          <div className="layout-engine">
            <button onClick={this.calculateDijkstra}>Calcular Dikjstra</button>
          </div>
          <div className="pan-list">
            <span>Selecciona Diagrama:</span>
            {cbxDiagrams}
          </div>
        </div>
        <GraphView
          ref={el => (this.GraphView = el)}
          nodeKey={NODE_KEY}
          nodes={nodes}
          edges={edges}
          diagrams={diagrams}
          selected={selected}
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
