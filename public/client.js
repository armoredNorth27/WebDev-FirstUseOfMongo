// Name: Alex Nedev
// Student Number: 101195595

//==================================================================================================//
//                                        login.pug Elements                                        //
//==================================================================================================//
const usernameField = document.getElementById('usernameField');
const passwordField = document.getElementById('passwordField');


//==================================================================================================//
//                                       register.pug Elements                                      //
//==================================================================================================//
const newUsername = document.getElementById('newUsername');
const newPassword = document.getElementById('newPassword');


//==================================================================================================//
//                                      userProfile.pug Elements                                    //
//==================================================================================================//
const makePrivate = document.getElementById('makePrivate');

//==================================================================================================//
//                                         Client Responses                                         //
//==================================================================================================//

//? Setups up the json object needed to log the user in
function loginSetup(){
    let userInfo = {"username": usernameField.value, "password": passwordField.value};

    login(userInfo, false);
}

//? Send a POST request to Log the user in
function login(userInfo, isNewUser){
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){
            const response = xhttp.response;

            if(response != 'Invalid Password' && response != 'User not found'){
                // console.log(response); //? Here for testing
                // If the user trying to log is has just been created, redirect to their profile
                if(isNewUser){
                    window.location.assign(`users/${userInfo.id}`);
                }
                else{
                    window.location.assign('/home');
                }
            }
        }
    };

    xhttp.open('POST', '/login', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(userInfo));
}

//? Creates a new user
function createUser(){
    let newUser = {"username": newUsername.value, "password": newPassword.value};

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===201){
            const response = xhttp.response.replace(/"/g, '');
            newUser.id = response;
            login(newUser, true);
        }
        else if(this.readyState===4 && this.status===400){
            const response = xhttp.response;
            alert(response);
        }
    };

    xhttp.open('POST', '/users', true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newUser));
}

//? Changes the privacy setting of the user
function changePrivacy(){
    let clientRequest = {userid: userID, privacy: false};
    console.log(JSON.stringify(clientRequest));

    if(makePrivate.checked){
        clientRequest.privacy = true;
    }
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){
            const response = xhttp.response;

            // console.log(response); //? For testing purposes
            window.location.assign(`/users/${userID}`); // Refresh the page
        }
        if(this.readyState===4 && this.status===403){
            const response = xhttp.response;
            alert(response);
        }
    };

    xhttp.open('PUT', `/users/${userID}`, true);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(clientRequest));
}