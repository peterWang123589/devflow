import Link from "next/link"
import Image from 'next/image'
interface ProfileLinkProps{
  imgUrl:string;
  href?:string;
  title:string;
}

const ProfileLink=({imgUrl,href,title}:ProfileLinkProps)=>{
  return (
    <div className='flex-center gap-1'>
      <Image src={imgUrl} alt="icon" width={20} height={20} />
      {href?<Link
      href={href}
      target='_blank'
      className='paragraph-medium text-blue-100'></Link>:(
        <p  className='paragraph-medium text-dark400_light700 ml-3' >
        {title}
        </p>
      )}

    </div>
  )
}
export default ProfileLink