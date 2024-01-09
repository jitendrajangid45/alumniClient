export interface chatKnownData{
    status: number,
    data : userData[]
}

export interface userData{
    id:number,
    email:string,
    password:string,
    firstName:string,    
    name:string,
    profile:string,
    lastMessage:string,
    sender_id:number,
    receiver_id:number,
    lastName:string,
    middleName:string,
    dateOfBirth:string,
    gender:string,
    profilePic:string,
    isVerified:number | boolean,
    registrationDate:string,
    lastLoginDate:string,
    accountStatus:string,
    batchYear:string,
    role:string,
    notificationCount:number,
    prefix:string,
    loginType:string,
    resetPasswordToken:string,
    isOnline:boolean | number
}

export interface searchUser{
    status: number,
    data: string
}

export interface chatMessages{
    chat_id: number,
    messages: string | Messages[],
    status: number
}

export interface Messages{
    chat_id: number,
    created_at: string,
    id: number,
    messages: string,
    file: string,
    sender_id : number,
    receiver_id:number,
    read:boolean,
    delivered:boolean
}

export interface getMessage{
    messages: Messages[]
}