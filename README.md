# README

The necessary steps to get the application up and running.

* System dependencies
  
  `docker`  
  `docker-compose`

* Configuration

  `docker volume create --name=chatbundle`  
  `docker volume create --name=chatdata`

* Application execution

  `docker-compose up -d --build`

* Database creation
  
  `docker-compose exec chat bundle exec rails db:create`

* Database initialization
  
  `docker-compose exec chat bundle exec rails db:setup`

* Node initialization

  `docker-compose exec chat yarn install`

* How to run the test suite
  
  `docker-compose exec chat bundle exec rails test`

* How to access application

  `GET http://localhost:3000/`

* Credentials

  `one@example.com`  
  `password`


## Feature Selection

The features were selected based on showcasing an application that
runs on a full stack and has a pleasant, familiar, look-and-feel. To 
demonstrate the front end features, specific back end features were 
selected to ensure the UI has the data it requires. Due to the front
and back end interdependence, more exotic features such as gif
suggestions and search were skipped as I feel these are biased
towards more specialized front and back end development.

### Frontend:
* See list of channels
* See history of messages in channel

### Backend:
* Persist chat messages in joined channels
* See list of channels
* See list of other users

## Possible Next Steps

With more time all of the application's features would be completed
and verified via integration testing, augmented with unit tests and
insuring proper code coverage. The front end refactored into 
component files. Websocket based channels implemented to facilitate
a proper interactive experience. Jobs created for the bulk of model
interactions to decouple them from the syncronious request/response
cycle.

### Assumptions

UX drives implementation. A familiar, intuitive interface is fundamental
for the success of an application, else its features are not going
to be used regardless of how useful they may be. Therefore a greater
focus was given to presentation on the front end. For the back end the
main assumption is that data that is supplied to the front end must be correct
and verified to be correct. Therfore focus on the back end leaned more
towards testing the API end points.