import "./userInfo.css"
import { useUserStore } from "../../../../lib/userStore";


const Userinfo = () => {
    const staticImage =
        "https://i.pinimg.com/736x/c0/74/9b/c0749b7cc401421662ae901ec8f9f660.jpg";


    const getImage = (imageFriend) => {
        if (imageFriend) {
            return `data:image/png;base64,${imageFriend}`;
        }
        return staticImage;
    };

    const { currentUser } = useUserStore();

    return (
        <div className='userInfo'>
            <div className="user">
                <img src="./avatar.png " alt="" />
                <h2 >{currentUser.first_name} </h2>
            </div>
            <div className="icons">
                <i className="fas fa-ellipsis-v"></i>
                <i className="fas fa-edit"></i>
            </div>
        </div>
    );
}

export default Userinfo; 