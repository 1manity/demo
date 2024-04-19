'use client'
import "./globals.css"

import {useState} from "react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";


export default function Home() {
  const [value, setValue] = useState("")
  const login = (password: string) => {

  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div>
        <div className={"w-64 flex"}>
          <Input type="password" placeholder="password" className={"mr-2"} onChange={e=>setValue(e.target.value)}/>
          <Button onClick={()=>login(value)}>登录</Button>
        </div>

        <div className="text-center text-sm mt-3">
          输入密码以登录
        </div>
      </div>


    </main>
  );
}
