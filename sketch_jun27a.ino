#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
DHT dht(14, DHT11); // D5 on esp8266
#define BUZZER 12 // D6 on esp8266
#define REDPIN 2 // D4 on esp8266
#define GREENPIN 13 // D7 on esp8266
// SDA  - D2
// SCL - D1


const char* ssid = "AIK";          // Your WiFi SSID
const char* password = "h8LL42u@!@!@!";  // Your WiFi password
const char* serverAddress = "http://192.168.8.137:3000";  

void setup()
{
  Serial.begin(115200);
  Serial.println("DHT11 Temperature and Humidity Sensor");
  dht.begin();  pinMode(BUZZER, OUTPUT);
  pinMode(REDPIN, OUTPUT);
  pinMode(GREENPIN, OUTPUT);

 connectToWiFi();
}
void loop()
{
  delay(2000); // Wait for 2 seconds between readings  
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();  
  if (isnan(temperature) || isnan(humidity))
  {
    Serial.println("Failed to read data from DHT sensor");
  }
  else
  {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C");
    Serial.println("");
    Serial.print(humidity);
    Serial.print(" %");    // Upload data to the server
    if (temperature > 25)
    {
      digitalWrite(BUZZER, HIGH);
      digitalWrite(REDPIN, HIGH);
    }
    else
    {
      digitalWrite(BUZZER, LOW);
      digitalWrite(GREENPIN, HIGH);
    }
  }
  // Upload data to the server
  sendDataToServer(temperature, humidity);
}


void connectToWiFi()
{
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("Connected to WiFi");
}


void sendDataToServer(float temperature, float humidity)
{
  WiFiClient client;
  HTTPClient http;
  
  // Build the URL with query parameters
  String url = serverAddress;
  url += "/api/data";
  url += "?temperature=" + String(temperature);
  url += "&humidity=" + String(humidity);

  Serial.println("Heeeeee");
  // Send HTTP GET request
  http.begin(client, url);
  http.setTimeout(10000); // Set timeout to 10 seconds (for example)
  int httpResponseCode = http.GET();
  Serial.println(httpResponseCode);
  if (httpResponseCode > 0)
  {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  }
  else
  {
    Serial.println("Error sending data to server");
  }
  
  http.end();
}
