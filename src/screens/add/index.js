import React ,{useState,useEffect} from 'react';
import {View,ScrollView,Text,StyleSheet,ActivityIndicator,Pressable, Alert} from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import { Headline , Button } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TextInput } from "react-native-paper";
import GetLocation from 'react-native-get-location';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import send_travel from "../../functions/travels/SendTravel"
import LatLonToAdress from "../../functions/travels/LatLonToAdress"
import Autocomplete from '../../components/Autocomplete';
import get_travels from '../../functions/travels/getTravels';

const AddTravel=()=> {

    const dispatch=useDispatch();
    const wilayass=useSelector(state => state.regions.wilayas)
    const [date, setDate] = useState(new Date())
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0)
    const [selected_wilaya, setWilaya] = useState(0)
    const [selected_commune, setCommune] = useState(0)
    const [selected_wilaya_destination, setWilayaDestination] = useState(0)
    const [selected_commune_destination, setCommuneDestination] = useState(0)
    const [departure_name, setDepartureName] = useState("")
    const [destination_name, setDestinationName] = useState("")
    const [lat, setLat] = useState("0")
    const [lon, setLon] = useState("0")
    const [positionLoader, setpositionLoader] = useState("none")
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [auto_wilayas, setAutoWilaya] = useState(wilayass);
    const [communeHolder,setCommuneHolder]=useState("commune")
    const [wilayaHolder,setWilayaHolder]=useState("wilaya")
    const [communeDestinationHolder,setCommuneDestinationHolder]=useState("commune")
    const [wilayaDestinationHolder,setWilayaDestinationHolder]=useState("wilaya")

    const [selected_communeError,setSelected_communeError]=useState("none")
    const [departure_nameError,setDeparture_nameError]=useState("none")
    const [lonError,setLonError]=useState("none")
    const [selected_commune_destinationError,setSelected_commune_destinationError]=useState("none")
    const [destination_nameError,setDestination_nameError]=useState("none")
    
    var days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const regions=useSelector(state => state.regions.wilayas);
    const token=useSelector(state => state.token.token);

    const filter = (item, query) => item.name.toLowerCase().includes(query.toLowerCase());



    useEffect(()=>{ //component did mount
        // dispatch({type:"SET_TITLE",payload:"home"})
        return ()=>{ //component  unmount
            
        }
      },[])



      const getloc=async()=>{
        setpositionLoader("flex")
        GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
      })
      .then(location => {
        setpositionLoader("none")
          console.log(location);
          setLat(location.latitude)
          setLon(location.longitude)
          LatLonToAdress(location.latitude,location.longitude,set_location_from_gps)
          
      })
      .catch(error => {
        setpositionLoader("none")
          Alert.alert("erreur","veuillez verifier que la localisation de l'appareil est bien activé , et réessayer ulterierment")
          const { code, message } = error;
          console.warn(code, message);
      })
      }

      const set_location_from_gps=(api_location)=>{
        wilayass.map(wilaya=>{
          wilaya.communes_list.map(commune=>{
            if(commune.postal_code==api_location.postcode)
            {
              setCommune(commune.id)
              setWilaya(wilaya.id)
              if(api_location.office!=undefined)
                setDepartureName(api_location.office)
            }
              
          })
          
        })
      }


    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setDate(date)
        hideDatePicker();
    };

    
    

    const register_travel=()=>{
      var errors=false;

      if(selected_commune==0)
        {errors=true;setSelected_communeError("flex")}
      if(departure_name=="")
        {errors=true;setDeparture_nameError("flex")}
        
      if(selected_commune_destination==0)
        {errors=true;setSelected_commune_destinationError("flex")}
      if(destination_name=="")
        {errors=true;setDestination_nameError("flex")}

      if (errors==false){ 

        setpositionLoader("flex")
  
          console.log(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`)
          send_travel(token,{
            date_time:`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`,
            // date_time:"2020-05-01 22:20",
            departure:selected_commune,
            departure_name:departure_name,
            long:lon,
            lat:lat,
            destination:selected_commune_destination,
            destination_name:destination_name,
          },()=>{
            setpositionLoader("none")
            Alert.alert("votre demande a bien été prise en charge");
  
            setDate(new Date())
            setHours(0);
            setMinutes(0)
            setWilaya(0)
            setWilayaDestination(0)
            setCommuneDestination(0)
            setDepartureName("")
            setDestinationName("")
            setLat("0")
            setLon("0")
            setDatePickerVisibility(false);
            setCommuneHolder("commune")
            setWilayaHolder("wilaya")
            setCommuneDestinationHolder("communee")
            setWilayaDestinationHolder("wilayaa")
      
            get_travels(dispatch);
          },(error)=>{
            
            setpositionLoader("none")
            if (error.code === 'ECONNABORTED')
              Alert.alert("pas de connexion internet");
            else  
              Alert.alert("veuillez renseigner tous les champs du formulaire");
  
            console.log(error.response.data);
          })
       }
    }


    return (
      <>
        <ScrollView>
           <Headline style={{textAlign:"center",backgroundColor:"#000", marginTop:0,padding:8}}> <Text style={{color:"#fff"}}> Demander une course </Text></Headline>
           
            <ActivityIndicator size="large" color="#0675bc" style={{display:positionLoader}}/>
            
            <View style={{padding:20}}>
              <View style={{padding:10,borderWidth:1,borderColor:"rgba(0,0,0,.3)",marginTop:15,backgroundColor:"white"}}>
                <Pressable 
                onPress={() => getloc()}
                >
                  <Text style={{fontWeight:"bold",fontSize:20,marginBottom:15}}>Localisation:</Text>
                  <View  style={{flexDirection:"row"}}>
                  <MaterialCommunityIcons name="map-marker" color="#0675bc" size={26} style={{}}/>
                    <Text> Lat:  {lon} </Text>
                    <Text> Lon: {lat} </Text>
                  </View>
                </Pressable>
                <Text style={{color:"brown",display:lonError}}> tapez pour se localiser </Text>
              </View>
            <View style={{padding:10,borderWidth:1,borderColor:"rgba(0,0,0,.3)",marginTop:15,backgroundColor:"#fff"}}>
              
            <Pressable onPress={showDatePicker} style={{marginTop:15}}>
                <View>
                        <Text style={{fontWeight:"bold",fontSize:20,marginBottom:15}}>Départ:</Text>
                        <View style={{flexDirection:'row', flexWrap:'wrap'}}><Text style={{fontSize:17,backgroundColor:"black",marginLeft:2,borderRadius:8,color:"#fff",paddingHorizontal:10,}}>{days[date.getDay()]} {date.getDate()}-{date.getMonth()+1}-{date.getFullYear()} <Text style={{color:"#0675bc"}}>{date.getHours()} : {date.getMinutes()} </Text></Text></View>
                </View>
            </Pressable>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
                    <View style={{ height:50}} >
                    <View style={{flex: 1,flexDirection: "row",width:"100%",position: 'absolute'}}>
                    <View style={{ flex:2,}} >

                    <Autocomplete
                      placeHolder="wilaya"
                      choices={regions}
                      searchPlaceHolder={wilayaHolder}
                      OnChange={(item)=>setWilaya(item.id)}
                      selected={selected_wilaya}
                      />
                    </View>
                    <View style={{ flex: 2,}} >

                    <Autocomplete
                  placeHolder={communeHolder}
                  choices={ selected_wilaya!=0 ?  regions.filter((wilaya)=>wilaya.id == selected_wilaya)[0].communes_list : []}
                  searchPlaceHolder={"chercher une commune"}
                  OnChange={(item)=>{setCommune(item.id) ;setSelected_communeError("none") }}
                  selected={selected_commune}
                  />

                    </View>
                </View>
                
                </View>
                <Text style={{color:"brown",display:selected_communeError}}> selectionner une wilaya et une commune  </Text>
                <TextInput
                    label="nom point de départ"
                    value={departure_name}
                    onChangeText={text =>{ setDepartureName(text); if(text.length>2) setDeparture_nameError("none") } }
                    theme={{ colors: {placeholder: '#6a6a6a',} }}
                    style={{backgroundColor:"#fff"}}
                />
                <Text style={{color:"brown",display:departure_nameError}}> remplir le nom point de départ </Text>
            </View>

            <View style={{padding:10,borderWidth:1,borderColor:"rgba(0,0,0,.3)",marginTop:20 , backgroundColor:"#fff"}}>
            <View style={{paddingTop:30}}>
            <Text style={{fontWeight:"bold",fontSize:20}}>Destination:</Text>
              <View style={{ height:50}} >
                <View style={{flex: 1,flexDirection: "row",width:"100%",marginBottom:100,position: 'absolute'}}>
                  <View style={{ flex:2,}} >
                  <Autocomplete
                  placeHolder={wilayaDestinationHolder}
                  choices={regions}
                  searchPlaceHolder={"chercher une wilaya"}
                  OnChange={(item)=>setWilayaDestination(item.id)}
                  selected={selected_wilaya_destination}
                  />
                  </View>
                <View style={{ flex: 2,}} >
                <Autocomplete
                  placeHolder={communeDestinationHolder}
                  choices={ selected_wilaya_destination!=0 ?  regions.filter((wilaya)=>wilaya.id == selected_wilaya_destination)[0].communes_list : []}
                  searchPlaceHolder={"chercher une commune"}
                  OnChange={(item)=>{setCommuneDestination(item.id); setSelected_commune_destinationError("none")}}
                  selected={selected_commune_destination}
                  />
                </View>
              </View>
            </View> 
              <Text style={{color:"brown",display:selected_commune_destinationError}}> selectionner une wilaya et une commune  </Text>

            <TextInput
                label="Nom point d'arrivé"
                value={destination_name}
                onChangeText={(name) => {setDestinationName(name);  if(name.length>2) setDestination_nameError("none") }}
                style={{backgroundColor:"#fff"}}
            />
             <Text style={{color:"brown",display:destination_nameError}}> remplir le nom point d'arrivé </Text>

        </View>
        <Button icon="send" mode="contained" onPress={() => register_travel()} style={{marginTop:20}}>
              Envoyer
            </Button>
        </View>
            </View> 
       

           

        </ScrollView>

        </>
    )
    // return (
    //   <Autocomplete
    //   placeHolder="wilaya"
    //   choices={regions}
    //   searchPlaceHolder={"chercher une wilaya"}
    //   OnChange={()=>}
    //   />
    // )
}

const styles=StyleSheet.create({
 container:
 {
   padding:20,
 }
})
export default  AddTravel;