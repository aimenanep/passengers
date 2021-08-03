import React ,{useState,useEffect} from 'react';
import {View,ScrollView,Text,Pressable} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { Title,Headline,Badge } from 'react-native-paper';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import get_travels from "../../functions/travels/getTravels";

const  List=({route , navigation})=> {
    const dispatch=useDispatch()
    const travels=useSelector(state => state.travels.travels)
    useEffect(()=>{ //component did mount
        // dispatch({type:"SET_TITLE",payload:"home"})
        get_travels(dispatch)
        return ()=>{ //component  unmount
            
        }
      },[])
      console.log("**********************",travels);


      const travel_color=(travel)=>{
        if(travel.status=="en cours")
            return "#a11500"
        if(travel.status=="attente")
            return "#cd3299"
        if(travel.status=="initial")
            return "#bc4606"
        if(travel.status=="termine")
            return "#896e6e"
      }


      const icon_color=(travel)=>{
        if(travel.status=="en cours")
            return "#00a157"
        if(travel.status=="attente")
            return "yellowgreen"
        if(travel.status=="initial")
            return "#0675bc"
        if(travel.status=="termine")
            return "#a2a2a2"
      }

    return (
        <ScrollView onMomentumScrollEnd={()=> get_travels(dispatch)}  stickyHeaderIndices={[0]}>
            <Headline style={{textAlign:"center",backgroundColor:"#000", marginTop:0,padding:8}}> <Text style={{color:"white"}}>Liste des courses</Text> </Headline>
            {travels.map(travel=>(
                 <Pressable key={travel.id} onPress={()=>{navigation.navigate("Details",{travel})}}>
            <View style={{flexDirection:"row",marginVertical:5 , borderColor:"rgba(0,0,0,.1)",borderWidth:1,paddingVertical:5,marginHorizontal:10,backgroundColor:"#fff"}} key={travel.id}>
                <View style={{width:"15%",alignItems:"center",alignContent:"center",justifyContent:"center"}}>
                    <MaterialCommunityIcons name="train-car" color={icon_color(travel)} size={40} />
                    
                </View>
                <View style={{padding:8,width:"65%"}}>
                    <Title> {travel.destination_name} </Title>
                    <Text> <MaterialCommunityIcons name="clock-outline" color={"#a2a2a2"}  /> {travel.date_time.replace("T"," ").replace("Z"," ")} </Text>
                    <Text> <MaterialCommunityIcons name="account" color={"#a2a2a2"}  /> {travel.pilot.username} </Text>
                    <Text> <MaterialCommunityIcons name="phone" color={"#a2a2a2"}  /> {travel.pilot.phone} </Text>
                    <Badge style={{marginRight:"auto",marginTop:4,width:80, fontWeight:"bold", backgroundColor:travel_color(travel),color:"#fff",fontSize:13}}>{travel.status}</Badge> 
                </View>
                <View style={{width:"20%",alignItems:"center",alignContent:"center",justifyContent:"center"}}>
                      <MaterialCommunityIcons name="arrow-right" color={"#030303"} size={20} />
                      
                </View>
            </View>
            </Pressable>
            
    ))}
            
        </ScrollView>
        
    )
}

export default List;