jest.mock("fs/promises");
const { readFile } = require("fs/promises");
const { startMarsRover, calculateMovement } = require("./rover");

// Rather than test the readFile function,
// we'll supply the string as it would be if parsed by ReadFile.

describe("Mars Rover", () => {
    describe('calculate Movement', () => {
        it('it should return the correct X and Y values based on direction', () => {
            const results1 = calculateMovement('N', 1, 1,);
            const results2 = calculateMovement('S', 2, 2,);
            const results3 = calculateMovement('E', 3, 3,);
            const results4 = calculateMovement('W', 4, 4,);
            expect(results1).toStrictEqual([1, 2]);
            expect(results2).toStrictEqual([2, 1]);
            expect(results3).toStrictEqual([4, 3]);
            expect(results4).toStrictEqual([3, 4]);
        })
    });



    
    it("should determine the appropriate outcome of the mars rover", async () => {
        const command = `4 8
        (2, 3, E) LFRFF
        (0, 2, N) FFLFRFF
        (0, 5, N) FFFFF`;
        readFile.mockResolvedValue(command);

        const results = await startMarsRover(command);

        expect(results).toStrictEqual([
            { commands: ["L", "F", "R", "F", "F"], direction: "E", isLost: false, x: 4, y: 4 },
            { commands: ["F", "F", "L", "F", "R", "F", "F"], direction: "N", isLost: false, x: -1, y: 6 },
            { commands: ["F", "F", "F", "F", "F"], direction: "N", isLost: true, x: 0, y: 10 },
        ]);
    });
});
