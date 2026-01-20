import React from 'react'
import { Link } from 'react-router-dom'

export default function FriendsList({friends}) {
  return (
    <div>
        <div className="friend-list">
        {friends.map((friend, index) => (
            <div key={friend.id_user} className="friend-item">
              #{index + 4}
              <div className="profile-picture">
                  <Link to={`/profileFriend/${friend.id_user}`}>
                    <img src={`data:image/png;base64,${friend.image}`} alt={`${friend.first_name}'s profile`} />
                  </Link>
              </div>
              <div className="friend-info">
                  <div className="friend-name">
                    <Link to={`/profileFriend/${friend.id_user}`}>
                      {friend.first_name} {friend.last_name}
                    </Link>
                  </div>
                  <div className="friend-likes">{friend.like_count} <span role="img" aria-label="heart">❤️</span></div>
              </div>
            </div>
        ))}
        </div>
    </div>
  )
}
