# MNist digits server

## Summary

This is a fastify server including web content to allow you to write mnist digits into a canvas element and have the numeric digit predicted.

## Technical details

The model was built in tensorflow/keras using a Jupyter notebook. The notebook trains on the mnist digit data set and saves the keras model. TODO link to that repo.

Once you have the keras model it is exported to tensorflowjs format TODO link to script so that it can be served via a node server and that library.

As the user draws into the canvas the image is periodically submitted to the server which returns the predictions.

### Production concerns

See https://www.tensorflow.org/js/guide/nodejs#production_considerations


## Conversion script

tensorflowjs is very fussy about Python versions and at time of writing is broken.
I finally got it working by installing Python 3.9 and manually applying the following change to the jaxlib python code. lmao.

https://github.com/tensorflow/tfjs/pull/8103/files

`tensorflowjs_converter --input_format keras ./model/digitsmodel.keras ./model/converted/`




