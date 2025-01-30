import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { RootStackParamList } from '../../App' 
import { StackNavigationProp } from '@react-navigation/stack'

const SplashScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'SplashScreen'>>()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('SigninScreen')
    }, 5000) 

    return () => clearTimeout(timer) 
  }, [navigation])

  return (
    <View style={styles.container}>
            <Text style={styles.title}>Welcome to</Text>
            <Text style={styles.title}>Real Time Sales App</Text>

      <Image source={require('../assets/splash.png')} style={styles.image} />
    </View>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf7e1f8',
    //   hsla(35.59322033898306, 76.62337662337666%, 84.90196078431373%, 0.671)
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 27,
    fontWeight: '700',
    color: '#f1af4a',
    marginHorizontal: 10,
    textAlign: 'center',
    letterSpacing: 2,
    textTransform: 'uppercase',
    shadowColor: '#b8b7ca',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    shadowOpacity: 0.7,
  },
})
