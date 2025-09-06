import io from "socket.io-client";
import { env } from "../core/service/envconfig";
var token = sessionStorage.getItem('socket_token');
console.log("socket comes -->>");
var userid = '';
console.log("userid -->>",userid);
if(token)
{
  // console.log("token-->>",token);
  let tokensplit = token.split("_");
  userid = tokensplit[0];
  // console.log("userid -->>",userid);
}
else
{
  userid =  new Date().getTime();
  // console.log("userid else -->>",userid);
}
export const socket = io(env.apiHost,{
  transports:['websocket', 'polling'],
  query: { user_id: userid },
  reconnection: true,
});