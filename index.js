// grid
// M X N// I assume that means
// robot has position x,y. Use commands: F, L to rotate Left, R to rotate Right// If it goes off-grid it's lost.// x -> x + 1 is east, y -> y + 1 is north.
// first line of input is the grid (So I assume we take in a txt file.// Next line is the initial state (on the grid, then the Direction)// Then it's the commands
// Output should be: (X, Y, Direction) {LOST ?
const grid = { x: 0, y: 0 };

const calculateMovement = (direction, currentX, currentY) => {
  switch (direction) {
    case "N":
      currentY  += 1;
      break;
    case "E":
      currentX += 1;
      break;
    case "S":
      currentY -= 1;
      break;
    case "W":
      currentX -= 1;
      break;
    default:
      console.log("uknown direction");
  }
  return [currentX, currentY];
};


const directionMap = {
    N: { 
        L: 'W',
        R: 'E'
    }, 

    E: { 
        L: 'N',
        R: 'S'
    },
    S: { 
        L: 'E',
        R: 'W'
    },
    W: { 
        L: 'S',
        R: 'N'
    },
};

const calculateDirection = (currentDirection, turn) => {
    return directionMap[currentDirection][turn];
}

const { readFile } = require("fs/promises");
const parseFileToCommandList = async (file) => {
  const data = await readFile(file, { encoding: "utf8" });
  return data;
};

const start = async (textFile) => {
  try {
    const commandList = await parseFileToCommandList(textFile);

    const [initialState, ...robotCommands] = commandList.split("\n");
    const [maxX, maxY] = initialState.split(" ");

    grid.x = Number(maxX);
    grid.y = Number(maxY);
    const robots = robotCommands.map(setupRobot);

    const finalRobotState = robots.map((robot) => {
      let newRobot = robot;
      robot.commands.map((command) => {
        if (command === "F") {
          const [newX, newY] = calculateMovement(
            robot.direction,
            robot.x,
            robot.y
          );
          newRobot.x = newX;
          newRobot.y = newY;
          if (newRobot.x > grid.x || newRobot.y > grid.y) {
            newRobot.isLost = true;
          }
        } else {
          newRobot.direction = calculateDirection(robot.direction, command);
        }
      });
      return newRobot;
    });

    finalRobotState.map((state) => {
        console.log(`(${state.x}, ${state.y}, ${state.direction}) ${state.isLost ? 'LOST' : ''}`);
    })
  } catch (error) {
    console.error(error);
  }
};

const setupRobot = (commandList) => {
  const initialStateRegex = /\(([^)]+)\)/g;
  const [initialRobotState] = commandList
    .match(initialStateRegex)
    .map((x) => x.replace(/[()]/g, ""));
  const commands = commandList.slice(commandList.lastIndexOf(")") + 1).trim();
  const [x, y, direction] = initialRobotState.split(", ");
  const isLost = Number(grid.x) < Number(x) || Number(grid.y) < Number(y);

  return {
    isLost,
    x: Number(x),
    y: Number(y),
    direction,
    commands: commands.split(''),
  };
};

start(process.argv[2]);
