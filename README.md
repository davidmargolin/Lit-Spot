# Lit-Spot 

<p align="center">
  <img src="https://user-images.githubusercontent.com/35040222/47387491-7d1d7880-d6dd-11e8-8d43-5ffd92e9634e.png" width="206" height="144">
</p>

### A mobile app that detects early wildfires and reduces loss
<p align="center">
<img src="https://images-2018.spaceappschallenge.org/team-photos/o8w6ZAk1ZH95SnxIJaQ_T44a-vg=/10830/width-800/">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/35040222/47387449-637c3100-d6dd-11e8-9e56-d5af20be0732.jpg" width="800" height="450">
</p>

<p align="center">
  <img src="https://user-images.githubusercontent.com/35040222/47387466-73941080-d6dd-11e8-82fa-9d3c535637aa.png" width= "288" height="512">
</p>

#### Background:

Over past years, humanity witnessed record-breaking wildfires across the world. Some of these fires lasted for weeks and caused billions of dollars in damage as well as loss of life that no amount of money can replace!

#### Resources:

We built a mobile app solution using React Native, Flask, Firebase and Postgresql. The front end is built on React Native so its compatible with both iOS and Android devices. We pulled live satellite data from NASA Earth database from which we were able to extract potential wildfire locations with abnormal heat emissions.

#### Challenges:

- find data sources we could use to figure out possible wild fire locations

- fetch data and serve to mobile devices so people can see a real time fire status on the map

- in order to support concurrent data access to mobile front ends, we had to extract useful information from the data source and save it to a queryable local data store, in this case Postgresql.

- heat maps aren't guaranteed sources of wildfire data. Such data still needs verification for which we created an intuitive reporting system

- save last known locations so users can receive notifications of fires in and around their area

#### Moving Forward:
In addition to wildfire visualization and reporting, we want to include a Safe Haven overlay to help those who need to find shelter, and to train our voice assistant to respond better to the needs of the users. Finally, traffic data is incredibly important when escaping a wildfire. (We have this feature available on Android devices.)
