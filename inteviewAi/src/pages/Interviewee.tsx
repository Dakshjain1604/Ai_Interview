import React,{useState} from "react"
import { useDispatch,useSelector} from "react-redux"
import type { RootState,AppDispatch } from "@/redux/store"

import { addCandidate } from "@/redux/slices/interviewSlice";

import { Upload,Button,Card,Alert,Spin } from "antd";
import { UploadOutlined,InboxOutlined } from "@ant-design/icons";

import type {UploadProps} from "antd"



const {Dragger}=Upload;


const Interviewee:React.FC=()=>{
  const dispatch=useDispatch<AppDispatch>();
  const candidate=useSelector((state:RootState)=>state.interview.currentCandidate);

  return (
    <div className="p-20 max-w-[800px] m-auto">
      <h1>
        Technical Interview Portal 
      </h1>
      <p>
        PLease Upload your reume to state the interview process
      </p>
    </div>
  )

}

export default Interviewee;