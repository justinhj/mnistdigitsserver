'use strict'

const tf = require('@tensorflow/tfjs-node')

module.exports = async function (fastify, opts) {

  const model = await tf.loadLayersModel('file://./model/converted/model.json');
//  model.summary();

  fastify.post('/predict', async function (request, reply) {
    let tensor = tf.tensor(request.body.tensor);
    let prediction = model.predict(tensor);
    return { 'prediction': JSON.stringify(prediction.dataSync()) }
  })
}
