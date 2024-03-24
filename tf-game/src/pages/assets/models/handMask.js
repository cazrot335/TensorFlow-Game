const fingerjoints = {
    thumb: [0, 1, 2, 3, 4],
    index: [0, 5, 6, 7, 8],
    middle: [0, 9, 10, 11, 12],
    ring: [0, 13, 14, 15, 16],
    pinky: [0, 17, 18, 19, 20],
};






export const drawHand = ( predictions , ctx) => {
    if (predictions.length > 0) {
        predictions.forEach((prediction) => {
            const landmarks = prediction.landmarks;

            for(let j = 0; j < Object.keys(fingerjoints).length; j++){
                let finger = Object.keys(fingerjoints)[j];
                //  Loop through pairs of joints
                for (let k = 0; k < fingerjoints[finger].length - 1; k++) {
                  // Get pairs of joints
                  const firstJointIndex = fingerjoints[finger][k];
                  const secondJointIndex = fingerjoints[finger][k + 1];
            
                  // Draw path
                  ctx.beginPath();
                  ctx.moveTo(
                    landmarks[firstJointIndex][0],
                    landmarks[firstJointIndex][1]
                  );
                  ctx.lineTo(
                    landmarks[secondJointIndex][0],
                    landmarks[secondJointIndex][1]
                  );
                  ctx.strokeStyle = "red";
                  ctx.lineWidth = 4;
                  ctx.stroke();
                }
              }
            




            for (let i = 0; i < landmarks.length; i++) {
                const x = landmarks[i][0];
                const y = landmarks[i][1];
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, 3 * Math.PI);
                ctx.fillStyle = "indigo";
                ctx.fill();
            }
        });
    }
}