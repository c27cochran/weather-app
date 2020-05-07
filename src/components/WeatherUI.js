// created by carter cochran - 05/06/2020
import React from 'react';
import PropTypes from 'prop-types';
import moment from "moment";
import { Grid, Typography } from '@material-ui/core';

// sunny, clear icon
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined';
// thunderstorm icon
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
// rain icon
import InvertColorsOutlinedIcon from '@material-ui/icons/InvertColorsOutlined';
// snow icon
import AcUnitOutlinedIcon from '@material-ui/icons/AcUnitOutlined';
// clouds icon
import CloudOutlinedIcon from '@material-ui/icons/CloudOutlined';

function WeatherUI(props) {
  const { weather, weatherType } = props;
  const date = moment().format('h:mm a / MMM Do YYYY')
  return (
    <div>
      <Grid container spacing={1}>
        {/* Weather type icon */}
        <Grid item>
          <div className="weather-icon-bg">
            {weatherType === 'clear' && <Brightness5OutlinedIcon fontSize="large" />}
            {(weatherType === 'clouds' || weatherType === 'partly') && <CloudOutlinedIcon fontSize="large" />}
            {weatherType === 'rain' && <InvertColorsOutlinedIcon fontSize="large" />}
            {weatherType === 'thunderstorm' && <FlashOnOutlinedIcon fontSize="large" />}
            {weatherType === 'snow' && <AcUnitOutlinedIcon fontSize="large" />}
          </div>
        </Grid>
        <Grid item xs container>
          <Typography variant="h6" className="weather-type-text">
            {weatherType === 'clear' && 'Clear'}
            {weatherType === 'clouds' && 'Overcast'}
            {weatherType === 'partly' && 'Partly Cloudy'}
            {weatherType === 'rain' && 'Raining'}
            {weatherType === 'thunderstorm' && 'Storming'}
            {weatherType === 'snow' && 'Snowing'}
          </Typography>
        </Grid>
      </Grid>
      {/* Temperature, locale and date pane */}
      <Grid container spacing={2}>
        <Grid item>
          <Typography variant="h1" className="temp-text" data-testid="weather-check">
            {parseInt(weather.main.temp)}&#176;
          </Typography>
        </Grid>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2}>
            <Grid item xs>
              <Typography variant="h3" className="city-text">
                {weather.name}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                {date}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* Mobile Grid */}
      <Grid container spacing={1} className="hide-desktop">
        <Grid item xs={12} md={2}>
          <p className="secondary-text">
            Feels like:
            <span className="bold">{parseInt(weather.main.feels_like)}&#176;</span>
          </p>
        </Grid>
        <Grid item xs={12} md={2}>
          <p className="secondary-text">
            Humidity:
            <span className="bold">{parseInt(weather.main.humidity)}%</span>
          </p>
        </Grid>
        <Grid item xs={12} md={2}>
          <p className="secondary-text">
            Low:
            <span className="bold">{parseInt(weather.main.temp_min)}&#176;</span>
          </p>
        </Grid>
        <Grid item xs={12} md={2}>
          <p className="secondary-text">
            High:
            <span className="bold">{parseInt(weather.main.temp_max)}&#176;</span>
          </p>
        </Grid>
      </Grid>
      {/* Showing a different style for desktop view...just because */}
      <Grid container spacing={2} className="hide-mobile">
        <Grid item xs container direction="row">
          <p className="secondary-text">
            Feels like: <span className="bold">{parseInt(weather.main.feels_like)}&#176;</span>
            <span className="divider">|</span>
            Humidity: <span className="bold">{parseInt(weather.main.humidity)}%</span>
            <span className="divider">|</span>
            Low: <span className="bold">{parseInt(weather.main.temp_min)}&#176;</span>
            <span className="divider">|</span>
            High: <span className="bold">{parseInt(weather.main.temp_max)}&#176;</span>
          </p>
        </Grid>
      </Grid>
    </div>
  );
}

WeatherUI.propTypes = {
  weather: PropTypes.shape({
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      humidity: PropTypes.number.isRequired,
      temp_min: PropTypes.number.isRequired,
      temp_max: PropTypes.number.isRequired,
    }).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  weatherType: PropTypes.string,
}

WeatherUI.defaultProps = {
  // values: 'clear', 'partly', 'clouds', 'rain', 'thunderstorm' or 'snow'
  weatherType: 'clear',
}

export default WeatherUI;
