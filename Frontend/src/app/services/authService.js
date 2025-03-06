const API_URL = "http://localhost:3000/users"; 

class AuthService{ 
          async register(name , email , password , role){
          try{ 
                    const response = await fetch(API_URL , { 
                              method:"POST",
                              headers:{"Content-Type":"application/json"},
                              body: JSON.stringify({name , email ,password ,role}),
                    });
                    const data = await response.json();
                    if(!response.ok) throw new Error(data.message || "some thing happend while register");
                    return data

          }catch(error){ 
                    console.error("wrong with register",error.message);
                    throw error;

          }
}


async login(email , password){ 
          try{ 
                    const response = await fetch(`${API_URL}/login`,{ 
                              method:"POST",
                              headers:{"Content-Type":"application/json"},
                              body:JSON.stringify({email,password}),
                    });
                    const data =await response.json();
                    if(!response.ok) throw new Error (data.message || "info for login not correct");
                    localStorage.setItem("token",data.token);
                    return data;
          }catch(error){ 
                    console.error("wrong within login",error.message);
                    throw error;
          }
}

logout() {
          localStorage.removeItem("token");
        }
      
        // !! return true or boolean
        isAuthenticated() {
          return !!localStorage.getItem("token");
        }

}

export default new AuthService();