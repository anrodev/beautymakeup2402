
export type AuthUserType = {
  token:string;
  user_email:string;
  user_nicename:string;
  user_display_name:string;
}

export type UserSessionType = AuthUserType & {id:number};
