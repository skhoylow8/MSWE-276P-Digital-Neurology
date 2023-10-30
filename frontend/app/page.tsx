import Image from 'next/image'
import Login from './auth/login/page'

export default function Home() {
  return (
    <div className="container flex justify-center items-center h-screen max-w-full">
        <Login></Login>
    </div>
  )
}
