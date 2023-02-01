function Astar(startNode, endNode) {
  let openSet = [];
  let closedSet = [];
  let path = [];
  let visitedNodes = [];

  openSet.push(startNode);
  while (openSet.length > 0) {
    let leastIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[leastIndex].f) {
        leastIndex = i;
      }
    }

    let current = openSet[leastIndex];
    visitedNodes.push(current);

    if (current === endNode) {
      let temp = current;
      path.push(temp);
      while (temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
      }

      return { path, visitedNodes };
    }

    openSet = openSet.filter(element => element !== current);
    closedSet.push(current);

    let neighbours = current.neighbours;
    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      if (!closedSet.includes(neighbour)) {
        let tempG = current.g + 1;
        let newPath = false;
        if (!openSet.includes(neighbour)) {
          newPath = true;
          openSet.push(neighbour);
        } else if (tempG < neighbour.g) {
          newPath = true;
        }

        if (newPath) {
          neighbour.g = tempG;
          neighbour.h = heuristic(neighbour, endNode);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }
      }
    }
  }

  return { path, visitedNodes, error: "No path found!" };
}

function heuristic(a, b) {
  let d = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  return d;
}

export default Astar;