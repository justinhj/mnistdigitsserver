Docker instructions for running locally on mac or windows

Build the image
docker build -t nmistdigits:latest .

Run it 
docker run -it -p 3000:3000 mnistdigits:latest bash

Note that the .dockerignore file is important to avoid having incompatible node modules copied over
