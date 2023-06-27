import React, { useEffect, useState } from 'react';
import { Bar } from "react-chartjs-2";
import { BarElement,  CategoryScale,Chart as ChartJS,Legend, LinearScale,Title, Tooltip } from "chart.js";
import axios from 'axios';
import './App.css'


ChartJS.register(CategoryScale, LinearScale, BarElement,Title,Tooltip,Legend);
const option = {
  responsive: true,
  plugins: {
    legend: { position: "top" },
    title: {
      display: true,
      text: "RCA Humidity - Temperature  Bar Chart",
    },
  },
};



export default function App() {

  const [temperatureValues, setTemperatureValues] = useState([]);
  const [humidityValues, setHumidityValues] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  

  useEffect(() => {
    fetchData();
  }, []);
  
  const formatTime=(timeString)=> {
    const date = new Date(timeString);
    const formattedTime = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    }).format(date);
    
    return formattedTime;
  }
  
  const baseUrl = 'http://localhost:4000';
  
  const fetchData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/display-data`);
      const fetchedData = response.data;

      console.log("fetched data: ",fetchData);
      setTimestamps(fetchedData.map((item) => formatTime(item.timestamp)));
      setTemperatureValues(fetchedData.map((item) => item.temperature));
      setHumidityValues(fetchedData.map((item) => item.humidity));
    }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    const data = {
      labels:timestamps,
      datasets: [
        {
          label: "Temperatures",
          data: temperatureValues,
          backgroundColor: "orange",
        },
        {
          label:'Humidity',
          data:humidityValues,
          backgroundColor:'blue'
        },
    
      ],
    
    };
    
    return (
      <div className="App">
        <Bar options={option} data={data} />
      </div>
    );
  }
  
  