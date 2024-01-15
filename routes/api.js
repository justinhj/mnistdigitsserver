'use strict'

const tf = require('@tensorflow/tfjs-node')

module.exports = async function (fastify, opts) {
  const inputTensorSize = 28 * 28;
  const model = await tf.loadLayersModel('file://./model/converted/model.json');

  fastify.post('/predict', async function (request, _reply) {
    if(!(Array.isArray(request.body.tensor) && request.body.tensor.length === inputTensorSize)) { 
      throw new Error('Invalid tensor size (should be 28x28 flat array)');
    }
    const input = tf.tensor(request.body.tensor);
    const reshaped = input.reshape([-1,28,28,1]);
    const prediction = model.predict(reshaped);
    const output = prediction.dataSync();
    return { 'prediction': Array.from(output) }
  })
}
