// created by carter cochran - 05/05/2020
import React, { Component } from 'react';
import {
  Toolbar,
  Typography,
  AppBar,
  LinearProgress,
  Paper,
  InputLabel,
  Input,
  IconButton,
  Button,
} from '@material-ui/core';
import MyLocationTwoToneIcon from '@material-ui/icons/MyLocationTwoTone';
import SearchIcon from '@material-ui/icons/Search';

import WeatherUI from './WeatherUI';
import background from '../assets/images/background.jpg';
import clearSky from '../assets/images/clear-sky.jpg';
import thunderstorm from '../assets/images/thunderstorm.jpg';
import clouds from '../assets/images/clouds.jpg';
import rain from '../assets/images/rain.jpg';
import snow from '../assets/images/snow.jpg';
import '../assets/css/Weather.css';

// would usually put this in .env file, but using as a constant for code sharing simplicity
const API_KEY ="af98b36fae6ae2c742dc0d5832d406c7";
const UNITS = "Imperial";
const LANG = "en";

// Type in "snow" to see an example
const snowData = {"coord":{"lon":-85.34,"lat":35.14},"weather":[{"id":602,"main":"Snow","description":"Heavy snow","icon":"13d"}],"base":"stations","main":{"temp":4.48,"feels_like":1.04,"temp_min":-3.01,"temp_max":15.4,"pressure":1017,"humidity":10},"visibility":16093,"wind":{"speed":21.92,"deg":320,"gust":27.51},"clouds":{"all":75},"dt":1588793401,"sys":{"type":1,"id":3618,"country":"US","sunrise":1588761882,"sunset":1588811468},"timezone":-14400,"id":4657633,"name":"Crested Butte","cod":200};

class Weather extends Component {
  constructor(props) {
    super(props);
    this.getLocation = this.getLocation.bind(this);
    this.setUserLocation = this.setUserLocation.bind(this);
    this.throwLocationError = this.throwLocationError.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.getWeather = this.getWeather.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.state = {
      bgPhoto: null,
      userCity: '',
      weatherReport: null,
      weatherType: 'clear',
      loading: false,
      error: false,
      errorMessage: '',
    }
  }

  getLocation = () => {
    this.setState({ loading: true });
    if ("geolocation" in navigator) {
      var options = {
        timeout: 5000,
      };
      navigator.geolocation.getCurrentPosition(this.setUserLocation, this.throwLocationError, options);
    } else {
      this.throwLocationError();
    }
  }

  setUserLocation = (position) => {
    if (position && position.coords) {
      this.getWeather('coords', position);
    }
  }

  throwLocationError = (err) => {
    // would normally put 'err' into a logger
    console.log('err', err);
    this.setState({
      loading: false,
      error: true,
      errorMessage: 'Location could not be found.\nPlease enter your city and state.',
    });
  }

  handleCityChange = (event) => {
    this.setState({ userCity: event.target.value });
  };

  // submit the form if user hits enter
  handleCityKeyDown = (event) => {
    if (event.keyCode === 13) {
      this.getWeather('city');
    }
  };

  handleReset = () => {
    this.setState({
      userCity: '',
      weatherReport: null,
    })
  }

  getWeather = (callType, position) => {
    this.setState({ loading: true });
    const { userCity } = this.state;
    // main API domain and params
    const apiUrl = 'http://api.openweathermap.org/data/2.5/weather';
    // query string differs based on type of call - user location btn (coords) or user input (city)
    let queryString;
    if (callType === "coords") {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;
      queryString = `?lat=${userLat}&lon=${userLon}&lang=${LANG}&appid=${API_KEY}&units=${UNITS}`;
    } else if (callType === 'city') {
      let city = userCity;
      if (userCity.includes(',')) {
        city = `${userCity},us`
      }
      queryString = `?q=${city}&lang=${LANG}&units=${UNITS}&appid=${API_KEY}`;
    }

    fetch(apiUrl + queryString).then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        this.setState({
          error: true,
          errorMessage: 'Weather unavailable.\nPlease try again.',
        });
      }
    }).then((data) => {
      let weatherData;
      // Type in "snow" to see an example...else use the real data
      if (userCity === 'snow') {
        weatherData = snowData.weather[0];
      } else {
        weatherData = data.weather[0];
      }
      // set the background image based on the type of weather
      switch(weatherData.main) {
        case 'Clear': {
          this.setState({ bgPhoto: clearSky });
          break;
        }
        case 'Clouds': {
          // id's 801 and 802 = partly cloudy, 803 and 804 = very cloudy
          if (weatherData.id === 801 || weatherData.id === 802) {
            this.setState({ bgPhoto: clearSky, weatherType: 'partly' });
          } else {
            this.setState({ bgPhoto: clouds, weatherType: 'clouds' });
          }
          break;
        }
        case 'Rain':
        case 'Drizzle': {
          this.setState({ bgPhoto: rain, weatherType: 'rain' });
          break;
        }
        case 'Thunderstorm': {
          this.setState({ bgPhoto: thunderstorm, weatherType: 'thunderstorm' });
          break;
        }
        case 'Snow': {
          this.setState({ bgPhoto: snow, weatherType: 'snow' });
          break;
        }
        default: {
          this.setState({ bgPhoto: background, weatherType: 'clear' });
          break;
        }
      }
      // for the "snow" example
      this.setState({ weatherReport: userCity === 'snow'? snowData : data, loading: false });
    }).catch((err) => {
      // would normally put 'err' into a logger
      console.log('err', err);
      this.setState( {
        error: true,
        errorMessage: 'Something went wrong\nPlease try again.',
        loading: false,
      })
    });
  }

  render() {
    const {
      bgPhoto,
      weatherReport,
      weatherType,
      userCity,
      loading,
      error,
      errorMessage,
    } = this.state;

    // dynamic background image based on weather type
    const styles = {
      container: {
        backgroundImage: `url(${bgPhoto || background})`,
        backgroundPosition: "center center fixed",
        backgroundSize: 'cover',
      }
    };
    return (
      <div className="background" style={styles.container}>
        <AppBar color="transparent" position="absolute" className="app-bar">
          <Toolbar>
            <Typography variant="h6">
              the.weather
            </Typography>
          </Toolbar>
        </AppBar>
        {/* inline z-index here for the linear gradient bg hack */}
        <div style={{zIndex: 2}}>
          {/* Display the loading screen */}
          {
            loading &&
              <div className="container">
                <LinearProgress color="secondary" />
              </div>
          }
          {/* Display the error state */}
          {
            error &&
              <Paper elevation={3} className="error-wrapper">
                <Typography variant="h6" color="error">
                  {errorMessage}
                </Typography>
              </Paper>
          }
          {/* Display the search container */}
          {
            (!loading && weatherReport === null) &&
              <div className="container">
                <div className="input-container">
                  <InputLabel htmlFor="user-city" className="location-label">
                    U.S. CITY
                  </InputLabel>
                  <Input
                    id="user-city"
                    type="text"
                    value={userCity}
                    fullWidth
                    disableUnderline
                    autoComplete="off"
                    placeholder="New York, NY"
                    onChange={this.handleCityChange}
                    onKeyDown={this.handleCityKeyDown}
                  />
                </div>
                {/* Search button - magnifying glass */}
                <div className="button-container">
                  <IconButton
                    id="search-weather"
                    aria-label="submit my location"
                    className="search-btn icon-btn"
                    onClick={() => this.getWeather('city')}
                  >
                    <SearchIcon fontSize="large" />
                  </IconButton>
                </div>
                {/* Separate to add some space for the geolocation button */}
                <div className="separator">
                  <span className="line" />
                  <Typography variant="h6" className="separator-text">
                    OR
                  </Typography>
                  <span className="line" />
                </div>
                {/* Geolocation button */}
                <IconButton
                  id="geolocation-btn"
                  aria-label="set my location"
                  className="location-btn icon-btn"
                  onClick={this.getLocation}
                >
                  <MyLocationTwoToneIcon fontSize="large" />
                  <Typography variant="h6" className="btn-label">
                    FIND ME
                  </Typography>
                </IconButton>
              </div>
          }
          {/* Display the weather UI component */}
          {
            (!loading && weatherReport) &&
              <div className="weather-container">
                <WeatherUI weather={weatherReport} weatherType={weatherType} />
                <Button
                  color="secondary"
                  variant="contained"
                  className="reset-btn"
                  onClick={this.handleReset}
                >
                  Change Location
                </Button>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default Weather;
