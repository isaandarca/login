import React, {useState} from 'react';

import {StyleSheet, Text,View,TouchableOpacity} from 'react-native';

import {TextInput,Headline,Button}from 'react-native-paper';





const FormularioLogin=(props)=>{
const {changeEstado,navigation}=props;

const[email,setEmail]=useState('');
const[password,setPassword]=useState('');

const [formError,setFormError]=useState({});
const [usuario,setUsuario]=useState({})




const onNavigation =()=>{
    if(usuario.administrador){
    navigation.navigate('administrador')}else{
        navigation.navigate('home')
    }
   
    

}






const login =()=>{
//    let errors={};
//    if (!formDatos.username|| !formDatos.password){
//        if(!formDatos.username)errors.email=true;
//        if(!formDatos.password)errors.password=true;
// //    }else if (!validateEmail(formDatos.email)){
// //        errors.email=true
//    }else{
    fetch('http://localhost:3000/api/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email:email,password:password}),
      })

   

     .then(function (results) {

       return results.json();

     })

     .then(function (res) {
    //      console.log(res)
       setUsuario(res.usuario)
    
    onNavigation()
      
console.log(res)
  

      

     });

// navigation.navigate('administrador')
// //    }
// //    setFormError(errors)
    }

//coges los daton con onChange
//TouchableOpcacity se comporta como button.
//para poner varios estilos lo guardas en un array y lo separas con comas creando una condicion con && .

const onChangeEmail =(e)=>{
    setEmail(e.nativeEvent.text)
}
const onChangePassword =(e)=>{
    setPassword(e.nativeEvent.text)
}



    return(
        <>
         <TextInput 
        text={email}
         placeholder="Usuario"
        //  placeholderTextColor='#fff'
         style={[styles.input,formError.username && styles.error]}
         onChange={(e)=>onChangeEmail(e)}
       
         />
         
           <TextInput 
       text={password}
         placeholder="Password"
        //  placeholderTextColor='#fff'
         style={[styles.input,formError.password && styles.error]}
         secureTextEntry={true}
         onChange={(e)=>onChangePassword(e)}
         
         />
            <TouchableOpacity onPress={login}>
            <Text style={styles.botonTexto}>Inicia Sesión</Text>
            </TouchableOpacity>
            <View style={styles.registro}>
            <TouchableOpacity onPress={changeEstado}>
            <Text style={styles.botonTexto}>Regístrate</Text>
            </TouchableOpacity>
            </View>
        </>
    )

}

export default FormularioLogin;


const styles=StyleSheet.create ({

    botonTexto:{
        color:'#828282',
        fontSize:18,

    },
    input:{
        height:40,
        width:"70%",
        marginBottom:18,
        color:'#828282',
        backgroundColor:'#dae7ee',
        // borderRadius:5,
        textAlign:'center',
        // borderColor:'#afb1b8',
        // borderWidth:1,

    },
    registro:{
        flex:1,
        justifyContent:'flex-end',
        marginBottom:20,

    },
    error:{
        borderColor:'#f80000',
    },

})
