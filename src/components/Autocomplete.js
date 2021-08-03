import React, { useState } from "react";
import { TextInput ,Searchbar } from 'react-native-paper'
import { Alert, Modal, StyleSheet, Text, Pressable, View , ScrollView } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Autocomplete(props) {
    const [modalVisible, setModalVisible] = useState(false);
    const [placeHolder,setPlaceHolder] = useState(props.placeHolder)
    const [selected_id,SetSelectedId]=useState(0)
    const [search,setSearch]=useState("")
   
    
    const get_placeholder=()=>
    {
      if( props.selected == 0) 
      return  placeHolder 
      else{
        var plc;
        props.choices.map((choice)=>{
          if ( choice.id == props.selected )
          plc=choice.name
        })
        return plc
      }
     
    }
    
    
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        
      >
        <View style={styles.centeredView}>
          <ScrollView style={{width:"100%",padding:25}}>
          <Pressable
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={{padding:5,backgroundColor:"red",color:"white",textAlign:"center",marginTop:10,marginBottom:30}}>Anuller</Text>
            </Pressable>

          <Searchbar
                placeholder={props.searchPlaceHolder}
                onChangeText={(text)=>{setSearch(text)}}
                value={()=>{}}
                style={{width:"100%"}}
                />
                {
                  props.choices.map(choice=>
                    {
                      if(search=="")
                    return(
                    <Pressable
                      key={choice.id}
                      onPress={() =>{ setModalVisible(!modalVisible),setPlaceHolder(choice.name),props.OnChange(choice);}}
                      
                    >
                      <Text   style={styles.AutocompleteChoice} >{choice.name}</Text>
                    </Pressable>
                    )
                    else 
                    {
                      if(choice.name.toLowerCase().includes(search.toLowerCase()))
                      return(
                        <Pressable
                          key={choice.id}
                          onPress={() =>{ setModalVisible(!modalVisible),setPlaceHolder(choice.name),props.OnChange(choice);}}
                      
                        >
                          <Text   style={styles.AutocompleteChoice} >{choice.name}</Text>
                        </Pressable>
                        )
                    }
                    }
                    )
                }
                
            
          </ScrollView>
        </View>
      </Modal>
      <Pressable
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.autocompleteInput} >{ get_placeholder() }  <MaterialCommunityIcons name="chevron-down" color={"#a2a2a2"} size={21} /> </Text>
      </Pressable>

    </View>
  );
};


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:"#fff",
        paddingBottom:70
    },
    autocompleteInput:
    {
      fontSize:21,
      padding:15
    },
    AutocompleteChoice:
    {
      padding:12,
      borderColor:"rgba(0,0,0,.2)",
      borderBottomWidth:1
    }
});
