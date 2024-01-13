# MNist digit handwriting recognition server

## Summary

This is small end to end ML project I did over xmas '23. I started by training a model on a publicly available data set of hand written digits which you can find here.

[https://www.kaggle.com/datasets/hojjatk/mnist-dataset](https://www.kaggle.com/datasets/hojjatk/mnist-dataset)

Then I built a frontend and server so you can draw digits in real time and which runs predictions on the trained model and shows what digit it thinks you probably drew. 

## Running

The backend is a Fastify/Node server, which also serves the frontend. To run simply execute:

```
npm install
npm run start
```

There is also a dev mode that will update and restart when you change source files.

```
npm run dev
```

You can also run using Docker, check README.docker.md.

## Technical details

The model was built in tensorflow/keras using a Jupyter notebook. The notebook trains on the mnist digit data set and saves the keras model. TODO link to the notebook.

Once you have the keras model it is exported to tensorflowjs format TODO link to script so that it can be served via a node server and that library.

As the user draws into the canvas the image is periodically submitted to the server which returns the predictions.

### Production concerns

See https://www.tensorflow.org/js/guide/nodejs#production_considerations

## Model Conversion

As noted above Keras models as exported from tensorflow are not ready to use by tensorflowjs. You can export it using tensoreflowjs's converter.

This repo contains both the exported model and the 

tensorflowjs is very fussy about Python versions and at time of writing is broken.
I finally got it working by installing Python 3.9 and manually applying the following change to the jaxlib python code. lmao.

https://github.com/tensorflow/tfjs/pull/8103/files

TODO notes on the Dockerfile used for the conversion. 

Then you can run the script as follows.

`tensorflowjs_converter --input_format keras ./model/digitsmodel.keras ./model/converted/`

## Things to do

1. Drawing area should be larger so you can see the pixels better (high)
2. Test on mobile (low)
3. Probabilities under digits instead of alone
4. Pixel data can be collapsed (maybe cheat and bring in material.css)
