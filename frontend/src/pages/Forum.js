import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config.json';
import io from 'socket.io-client';
import ForumPage_Navbar from '../components/ForumPage_Navbar';
import Gr from "../utils/Gr";
import NoteIcon from '../assets/sticky-note.png';

export default function Forum() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [graph, setGraph] = useState({});
  const ws = io.connect('http://127.0.0.1:8000');
  
  useEffect(() => {
    console.log("NODE: ", nodes)
    if (ws) {
      console.log("initWebSocket 1");
      initWebSocket();
    }
  });
  
  const getNodes = async () => {
    const fetchData = await axios.get(`${config[8].getNode}/1`, {
      headers: {
        authorization: 'Bearer JWT Token',
      },
    });
    console.log(nodes);
    console.log("API Response Nodes:", fetchData.data[0].Nodes);

    const nodeData = fetchData.data[0].Nodes.map((node) => ({
      id: node.id,
      label: node.title,
      title: node.content,
      shape: 'image',
      image: NoteIcon,
      size: 100,
    }));
    console.log('nodeData: ', nodeData);
    const tempGraph = {
      nodes: [
        { id: 1, label: 'Node 1', title: 'node 1 tootip text' },
        { id: 2, label: 'Node 2', title: 'node 2 tootip text' },
        { id: 3, label: 'Node 3', title: 'node 3 tootip text' },
        { id: 4, label: 'Node 4', title: 'node 4 tootip text' },
        { id: 5, label: 'Node 5', title: 'node 5 tootip text' },
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
      ],
    };
    setGraph(tempGraph);
    console.log('graph: ', graph);
      
    
  };
  
  const initWebSocket = () => {
    
    console.log("initWebSocket 2");
    ws.on('connect', () => {
      console.log("connect 1", ws.id);
    });

    ws.on('event02', (arg, callback) => {
      
      console.log("connect [event02]",arg);
      getNodes();
      callback({
        status: 'event02 ok',
      });
    });
  };

  console.log('graph.node: ', nodes);
  console.log('graph.edges: ', edges);

  

  const options = {
    layout: {
      randomSeed: 23,
      hierarchical: {
        enabled: true,
        blockShifting: true,
        edgeMinimization: true,
        direction: 'LR',
        sortMethod: 'directed',
      },
    },
    interaction: {
      navigationButtons: true,
    },
    edges: {
      color: '#8B8B8B',
      length: 300,
      color: { inherit: 'from' },
      smooth: {
        enabled: true,
        type: 'dynamic',
        roundness: 1,
      },
      arrows: {
        from: {
          enabled: true,
          scaleFactor: 0.7,
        },
        to: {
          enabled: false,
        },
      },
    },
    nodes: {
      shape: 'box',
      scaling: {
        min: 10,
        max: 30,
        label: {
          min: 8,
          max: 30,
          drawThreshold: 12,
          maxVisible: 20,
        },
      },
      font: {
        size: 12,
        face: 'Tahoma',
      },
    },
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };

  return (
    <div className="home-container">
      <ForumPage_Navbar />
      <div
        id="graph"
        style={{
          flex: 1,
          height: '100vh',
          overflow: 'auto',
          position: 'fixed',
          top: '0',
          left: '0',
          marginLeft: '64px',
        }}
      >
        <Gr graph={graph} options={options} events={events} />
      </div>
    </div>
  );
}
