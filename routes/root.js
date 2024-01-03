'use strict'

const tf = require('@tensorflow/tfjs-node')

module.exports = async function (fastify, opts) {

  const model = await tf.loadLayersModel('file://./model/converted/model.json');
//  model.summary();

  fastify.post('/predict', async function (request, reply) {
    // TODO validate the input is the expected size
    const input = tf.tensor(request.body.tensor);
    const reshaped = input.reshape([-1,28,28,1]);
    const prediction = model.predict(reshaped);
    const output = prediction.dataSync();
    return { 'prediction': Array.from(output) }
  })
}
