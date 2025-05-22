import 'dotenv/config'

export function validatePassword(password:string):Promise<string> {
  const correctPassword=process.env.appPassword||"";

  return new Promise((resolve, reject) => {
    if(password==correctPassword){
      resolve("access granted")
    }
    else {
      reject({
        message:"Access Denied",
        ok:false,
      })
    }
  })
  
}