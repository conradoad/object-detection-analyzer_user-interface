
export type Params = {
    model: string,
    minNeighbors: number,
    numberOfSamples: number,
    scaleFactor_x_axis: {
        from: number,
        to: number,
        steps: number,
    };
    minSize_y_axis: {
        from: number,
        to: number,
        steps: number,
    }
}