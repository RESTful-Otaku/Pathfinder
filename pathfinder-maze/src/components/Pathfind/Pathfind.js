import React, {useState, useEffect } from 'react';
import Node from '../Node/Node';
import Astar from '../../aStarAlgorithm/aStar';
import './Pathfind.css';

const cols = 15;
const rows = 15;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const Pathfind = () => {
  const [Grid, setGrid] = useState([]);
  const [Path, setPath] = useState([]);
  const [visitedNodes, setVisitedNodes] = useState([]);

  useEffect(() => {
    initialiseGrid();
  });

  // Creates the Grid
  const initialiseGrid = () => {
    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
    }

    createSpot(grid);

    setGrid(grid);

    addNeighbours(grid);
    const startNode = grid[NODE_START_ROW][NODE_START_COL];
    const endNode = grid[NODE_END_ROW][NODE_END_COL];
    let path = Astar(startNode, endNode);
    startNode.isWall = false;
    endNode.isWall = false;
    setPath(path.path);
    setVisitedNodes(path.visitedNodes);
  };

  // Creates the spot
  const createSpot = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  // Add Neighbours
  const addNeighbours = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j].addNeighbours(grid);
      }
    }
  }

  // Spot Constructor
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.g = 0;
    this.f = 0;
    this.h = 0;
    this.neighbours = [];
    this.isWall = false;
    if (Math.random(1) < 0.2) {
      this.wall = true;
    };
    this.previous = undefined;
    this.addNeighbours = function(grid) {
      let i = this.x;
      let j = this.y;
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);
    };
  }

  // Grid with node
  const gridWithNode = (
    <div>
      {Grid.map((row, rowIndex) => {
        return (
          <div key={rowIndex} className='rowWrapper'>
            {row.map((col, colIndex) => {
              const { isStart, isEnd, isWall } = col;
              return (
                <Node
                  key={colIndex}
                  isStart={isStart}
                  isEnd={isEnd}
                  row={rowIndex}
                  col={colIndex}
                  isWall={isWall}
                />
              )
            })}
          </div>
        )
      })}
    </div>
  )

  const visualiseShortestPath = (shortestPathNodes) => {
    for (let i = 0; i < shortestPathNodes.length; i++) {
      setTimeout(() => {
        const node = shortestPathNodes[i];
        document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-shortest-path";
      }, 10 * i);
    }
  }

  const visualisePath = () => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => {
          visualiseShortestPath(Path);
        }, 20 * i);
      } else {
        setTimeout(() => {
          const node = visitedNodes[i];
          document.getElementById(`node-${node.x}-${node.y}`).className =
          "node node-visited";
        }, 20 * i);
      }
    }
  }

  return (
    <div className='wrapper'>
      <button onClick={visualisePath}>Visualise Path</button>
      <h1>Pathfind Component</h1>
      {gridWithNode}
    </div>
  );
};

export default Pathfind;