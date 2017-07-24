import React, { Component,PropTypes } from 'react';

import {Animated, View, Text,StyleSheet} from 'react-native'

export default class Bar_chart extends Component {
  constructor () {
    super()
    this.state = {
      congestion: new Animated.Value('20%')
    }
  }
  
  handeleAnimation () {
    const timing = Animated.timing
    const indicators = ['pts', 'ast', 'reb']
    Animated.parallel(indicators.map(item => {
      return timing(this.state[item], {toValue: width[item]})
    })).start()
  }
  
  render () {
   const {congestion} = this.state;
  
   return (
      <View>
       {congestion &&
          <View>
              <Text style={styles.label}> Current Congestion At the Place </Text>
              <Animated.View style={[styles.bar, styles.points, {width: '100%'}]} /></View>
        }
        <Text onPress={this.handeleAnimation.bind(this)}>Button</Text>
      </View>
   )
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
    color: '#CBCBCB',
    flex: 1,
    fontSize: 18,
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

Bar_chart.propTypes = {
  data: PropTypes.array
}