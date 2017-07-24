import React, { Component,PropTypes } from 'react';
import { AppRegistry,TextInput,View,Text,Button,AlertIOS,StatusBar,ScrollView,FlatList,StyleSheet,Animated,Modal,TouchableHighlight,WebView } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from "./Geolocation";
import { Card } from 'react-native-material-design';
import HTMLView from 'react-native-htmlview';





export default class gridLock extends Component {
    constructor(props) {
        super(props);
        this.state = { showRouteForKey:'',routeSteps:[],searchResults:[],start: 'Chamrajpet',end:'Kormangala',reachAt:'',showMap:false,buttonText:'Show my Current Location on Map',congestion: new Animated.Value('20%'),statusColor:{backgroundColor: '#F55443'},modalVisible:false};
    }

    render() {
        const {congestion} = this.state;
        return (
            <ScrollView style={{padding: 10}}>
                <Text style={{marginTop:'15%',marginLeft:'22%'}}> Grid Lock Demo App!!! </Text>
                    <TextInput
                        style={{height: 40, borderColor: 'gray', borderWidth: 1,marginTop:'4%',width:'70%',marginLeft:'12%'}}
                        onChangeText={(text) => this.setState({start:text})}
                        placeholder={'Source?'}
                        value={this.state.start}
                    />
                {/*<Text style={{marginLeft:'20%'}}> Your Current Location is: </Text>*/}
               {/*<Geolocation/>*/}
                {/*<MapView*/}
                    {/*style={{ height: 150,margin: 10,borderWidth: 1,borderColor: '#000000',display:'none'}}*/}
                    {/*showsUserLocation={true}*/}
                {/*/>*/}
                {this.state.showMap &&
                <MapView
                    style={{ height: 150,margin: 10,borderWidth: 1,borderColor: '#000000'}}
                    showsUserLocation={true}
                />
                }
                <Button
                    onPress={(event) =>{
                        if(this.state.showMap == false){
                            this.setState({
                                showMap: true,
                                buttonText:'Hide the map '
                            })
                        }
                        else{
                            this.setState({
                                showMap: false,
                                buttonText:'Show my Current Location on Map '
                            })
                        }
                      }
                    }
                    title={this.state.buttonText}
                    color="#841584"
                />
                <Button
                    onPress={(event) =>
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                fetch('https://maps.googleapis.com/maps/api/geocode/json?latlng='+position.coords.latitude +','+position.coords.longitude+'&key=AIzaSyCcRIHI3g-TXpFDY0vm9wC1hBTlzqxYfNs')
                                    .then((response) => response.json())
                                    .then((responseJson) => {
                                        this.setState({
                                            start: responseJson.results[0].formatted_address
                                        });
                                    })
                                    .catch((error) => {
                                        console.error(error);
                                    });
                            },
                            (error) => {
                                this.setState({
                                    start: 'Error,Please Try Again!'
                                });
                            },
                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
                        )
                    }
                    title="Use my Current Location"
                    color="#841584"
                />
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1,marginTop:'3%',width:'70%',marginLeft:'12%'}}
                    onChangeText={(text) => this.setState({end:text})}
                    placeholder={'Destination?'}
                    value={this.state.end}
                />
                <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1,marginTop:'3%',width:'70%',marginLeft:'12%'}}
                    onChangeText={(text) => this.setState({reachAt:text})}
                    placeholder={' Reach At?'}
                />
                <View>
                    <StatusBar
                        backgroundColor="blue"
                        barStyle="light-content"
                    />
                </View>
                <Button
                    onPress={(event)=>
                          fetch("https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.start +  "&destination=" + this.state.end + "&mode=DRIVING&alternatives=true&key=AIzaSyAx_N02GCPZ_9QOpYC_xJMUIwKo6rHuUBk")
                                .then((response) => response.json())
                                .then((responseJson) => {
                                    this.setState({searchResults:[]})
                                    responseJson.routes.forEach(function(element) {
                                        {/*console.log(element.legs[0].arrival_time,element.legs[0].distance,element.legs[0].duration);*/}
                                            if(element.legs[0].steps.length==14){
                                                temp = element.legs[0].steps.length*2;
                                                color = '#00fa9a';
                                            }
                                            else if(element.legs[0].steps.length==18){
                                                temp = element.legs[0].steps.length*4;
                                                color =  '#ffd700';
                                            }
                                            else{
                                                temp = element.legs[0].steps.length*5;
                                                color = '#ff4500';
                                            }
                                            this.state.searchResults.push({
                                                key: element.overview_polyline.points,
                                                distance:element.legs[0].distance.text,
                                                duration: element.legs[0].duration.text,
                                                summary: element.summary,
                                                steps: element.legs[0].steps,
                                                congestionPercent: temp,
                                                backgroundColor: color
                                            });
                                        
                                             this.setState({
                                                    searchResults: this.state.searchResults.slice(0),
                                            });

                                        }, this);
                                })
                                .catch((error) => {
                                    console.error(error);
                                })
                        }
                    title="Calculate"
                    color="#841584"
                />
                <Text> Found {this.state.searchResults.length} Routes to your Destination {"\n"}</Text>
                <FlatList
                    data={this.state.searchResults}
                    renderItem={({item}) => (
                        <Card style={{ backgroundColor: '#6495ed' }}>
                            <Card.Body>
                                {/*<Text>{`\u2022 ${item.name}`}</Text>*/}
                                 <View>
                                    <Text>Distance {item.distance}</Text>
                                    <Text>Duration {item.duration}</Text>
                                    <Text>Summary: {item.summary} {"\n"}</Text>
                                    <Text>Current Congestion At the Place:  {"\n"} </Text>
                                    {congestion &&
                                        <View>
                                            <Animated.View style={[styles.bar, {backgroundColor: item.backgroundColor}, { width: item.congestionPercent +'%' }]} />
                                            <Text> {item.congestionPercent}{"\n"} </Text>
                                        </View>
                                    }

                                </View>
                            </Card.Body>
                            <Card.Actions position="right">
                                <Button
                                    onPress={(event) => {
                                         this.setState({
                                                modalVisible:true,
                                                showRouteForKey:item.key,
                                                routeSteps: item.steps
                                            });
                                    }}
                                    title="View Route"
                                    color="cornsilk"
                                />
                            </Card.Actions>
                        </Card>
                   )}
                />
                <View style={{marginTop: 22}}>
        <Modal
          animationType={"fade"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <View style={{marginTop: 42,paddingBottom:200}}>
          <View>
            <Text style={{textAlign:'center'}}> Here is the how to get there!! {"\n"} </Text>
            <TouchableHighlight onPress={() => {
                this.setState({ modalVisible: false })
            }}>
            <Text style={{backgroundColor:'cornflowerblue',textAlign:'center',fontSize:22}}>Close {"\n"}</Text>
            </TouchableHighlight>

            <FlatList
                data={this.state.routeSteps}
                keyExtractor= {(item,index)=> item.distance.text + item.duration.text + index}
                renderItem={({ item }) => (
                    <Card style={{ backgroundColor: 'darkturquoise' }}>
                            <Card.Body>
                                {/*<Text>{`\u2022 ${item.name}`}</Text>*/}
                                <ScrollView>
                                    <Text>Distance: {item.distance.text}</Text>
                                    <Text>Duration: {item.duration.text} {"\n"}Insructions: {"\n"}</Text>
                                    <HTMLView
                                        value={item.html_instructions}
                                    />
                                    <Text> {"\n"}{"\n"}</Text>
                                </ScrollView>
                            </Card.Body>
                            <Card.Actions position="right">
                                <Button
                                    onPress={(event) => {
                                         console.log("click");
                                    }}
                                    title="Check"
                                    color="black"
                                />
                            </Card.Actions>
                        </Card>
                )}
            />
          </View>
         </View>
        </Modal>

        {/*<TouchableHighlight onPress={() => {
          this.setState({modalVisible:true})
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>*/}

      </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    marginTop: 6
  },
  // Item
  item: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 10
  },
  label: {
    color: 'black',
    flex: 1,
    fontSize: 12,
    position: 'relative',
    top: 2
  },
  // Bar
  bar: {
    alignSelf: 'center',
    borderRadius: 5,
    height: 12,
    marginRight: 5
  },
  points: {
    backgroundColor: '#F55443'
  }

})

gridLock.propTypes = {
  data: PropTypes.array
}

