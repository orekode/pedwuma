import {Link} from 'react-router-dom';

export default function ({load=true, image = '/images/worker.png', title='No Proposals Yet', text='Visit the jobs page and add jobs to your account to recieve proposals!', classname="min-h-[500px]", link=null}) {
    if(load)
    return (
    <div className={`emptybox ${classname} flex flex-col items-center justify-center text-center p-2`}>
        <img src={image} className="object-cover h-[200px] w-[200px] rounded-full " />
        <h3 className="font-bold pops text-2xl mb-1 orb">{title}</h3>
        <p className="pops text-sm mb-3 max-w-[330px]">
            {text}
        </p>
        {
            link &&
            <Link to={link[1]} className="px-4 py-2 rounded-md text-sm pops text-white bg-blue-600 hover:bg-blue-500  ">{link[0]}</Link>
        }
    </div>
  )
}