
#include <rn2xx3.h>
#include <SoftwareSerial.h>
#include <ArduinoJson.h>
SoftwareSerial mySerial(10, 11);
int data;
int relay = 8;
double sensorValue1 = 0;
double sensorValue2 = 0;
int crosscount = 0;
int climb_flag = 0;
int val[100];
int max_v = 0;
double VmaxD = 0;
double VeffD = 0;
double Veff = 0;
int flowPin = 9;    
volatile int count;
const int input = A1;

int X;
int Y;
float TIME = 0;
float FREQUENCY = 0;
int WATER = 0;
float TOTAL = 0;
float LS = 0;
String power="";
String motor="";
StaticJsonBuffer<200> jsonBuffer;
JsonObject& root = jsonBuffer.createObject();
    

rn2xx3 myLora(mySerial);

void setup()
{
  pinMode(relay, OUTPUT);
  pinMode(flowPin, INPUT);           
  attachInterrupt(0, Flow, RISING);
  Serial.begin(57600); 
  Serial1.begin(9600);
  mySerial.begin(9600); 
  Serial.println("Startup");

  initialize_radio();
  myLora.tx("TTN Mapper on TTN Enschede node");
  delay(2000);
}

void initialize_radio()
{
  //reset rn2483
  pinMode(12, OUTPUT);
  digitalWrite(12, LOW);
  delay(500);
  digitalWrite(12, HIGH);

  delay(100); 
  mySerial.flush();
  myLora.autobaud();

  String hweui = myLora.hweui();
  while(hweui.length() != 16)
  {
    Serial.println("Communication with RN2xx3 unsuccesful. Power cycle the board.");
    Serial.println(hweui);
    delay(10000);
    hweui = myLora.hweui();
  }

  Serial.println("When using OTAA, register this DevEUI: ");
  Serial.println(myLora.hweui());
  Serial.println("RN2xx3 firmware version:");
  Serial.println(myLora.sysver());

  Serial.println("Trying to join TTN");
  bool join_result = false;

  join_result = myLora.initABP("02017201", "8D7FFEF938589D95AAD928C2E2E7E48F", "AE17E567AECC8787F749A62F5541D522");

  while(!join_result)
  {
    Serial.println("Unable to join. Are your keys correct, and do you have TTN coverage?");
    delay(60000); 
    join_result = myLora.init();
  }
  Serial.println("Successfully joined TTN");
//  mySerial.println("mac set adr on\r\n");
//  delay(100);
//  String rec_adr = mySerial.readString();
//  Serial.println("adr:" + rec_adr);
//  mySerial.println("mac set ar on\r\n");
//  delay(100);
//  String rec_ar = mySerial.readString();
//  Serial.println("ar:" + rec_ar);
//  mySerial.println("mac pause\r\n");
//  delay(100);
//  String rec_pause = mySerial.readString();
//  Serial.println("mac pause:" + rec_pause);
//  mySerial.println("radio rx 0\r\n");
//  delay(300);
//  String rec_radio = mySerial.readString();
//  Serial.println("radio rx:" + rec_radio);
//  mySerial.println("mac resume\r\n");
//  delay(100);
//  String rec_res = mySerial.readString();
//  Serial.println("mac resume:" + rec_res);
}

void loop ()
{
  Serial1.write("s");
  for(int i=0;i<50;i++)
  {
  if (Serial1.available()>0)
  {
     data=Serial1.read();
    Serial.println(data);
  }
  }
  if(data==1)
  {
    digitalWrite(relay, HIGH);
    Serial.println("Motor on");
    motor="ON";
  }
  if(data==2)
  {
    digitalWrite(relay, LOW);
    Serial.println("Motor off");
    motor="OFF";
  }
  X = pulseIn(input, HIGH);
  Y = pulseIn(input, LOW);
  TIME = X + Y;
  FREQUENCY = 1000000/TIME;
  WATER = FREQUENCY/7.5;
  LS = WATER/60;
  if(WATER>=0)
  {
    if(isinf(FREQUENCY))
    {
      WATER=0;
    }
    Serial.println("Water flow:");
    Serial.print(WATER);
    Serial.println(" L/hour");
  }
  for ( int i = 0; i < 100; i++ ) {
    sensorValue1 = analogRead(A0);
    if (analogRead(A0) > 511) {
      val[i] = sensorValue1;
    }
    else {
      val[i] = 0;
    }
    delay(1);
  }

  max_v = 0;

  for ( int i = 0; i < 100; i++ )
  {
    if ( val[i] > max_v )
    {
      max_v = val[i];
    }
    val[i] = 0;
  }
  if (max_v != 0) {


    VmaxD = max_v;
    VeffD = VmaxD / sqrt(2);
    Veff = (((VeffD - 420.76) / -90.24) * -210.2) + 210.2;
  }
  else {
    Veff = 0;
  }
  if(Veff<100)
  {
  Serial.println("Power:OFF ");
//  power="4f46464f4646";
  power="OFFOFF";
  }
  else
  {
  Serial.println("Power:ON ");
  if(motor=="ON")
//  power="4f4e204f4e20";
    power="ON ON ";
  else
//  power="4f4e204f4646";
    power="ON OFF";
  }
  VmaxD = 0;
//
////  root={"power": power ,"water flow rate":water}; 
////  Serial.print("TXing");
//  const char* msg; 
//// root.printTo(msg);
//  WATER=WATER+30;
//   mySerial.println("mac tx cnf 1 "+power+WATER+"\r\n");
//  delay(1000);
//  Serial.print("TXing");
    Serial.print("TXing");
    myLora.txUncnf(power+WATER); //one byte, blocking function

//  myLora.txUncnf(power); //one byte, blocking function
//  for(int i=0;i<30;i++)
//  {
//  String received = mySerial.readString();
//  Serial.println("Transmission:" + received);
//  if(received == "mac_err\r\n")
//  break;
//  }
}
void Flow()
{
   count++; //Every time this function is called, increment "count" by 1
}
