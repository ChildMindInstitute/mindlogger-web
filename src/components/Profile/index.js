import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { userInfoSelector } from '../../state/user/user.selectors'
import Avatar from '../Base/Avatar'

import './style.css'

/**
 *
 * Component to display User Profile
 * @constructor
 */
const Profile = () => {
  const { t } = useTranslation()
  const [width, setWidth] = useState(window.innerWidth);
  const user = useSelector(state => userInfoSelector(state))

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }

  const isMobile = (width <= 768);

  return (
    <div className="p-3 h-100">
      <div className="heading">
      <Avatar />
        <h1>
          {user?.firstName} {user?.lastName}
        </h1>
      </div>
      <hr/>
      <div>
       {t('Profile.description')}
      </div>

      {isMobile &&
        <div className="d-flex justify-content-around align-items-center my-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.childmindinstitute.exposuretherapy&hl=en_US&gl=US"
            target="_blank" 
          > 
            <img
              style={{ maxWidth: '60px', width: '100%' }}
              className="mb-2 mr-4"
              src="/androidbg1.png"
            />
          </a>

          <a href="https://apps.apple.com/us/app/mindlogger-pilot/id1301092229#?platform=iphone" target="_blank">
            <img
              style={{ maxWidth: '70px', width: '100%' }}
              className="mb-2 ml-2"
              src="/applebg3.png"
            />
          </a>
        </div>
      }
    </div>
  )
}

export default Profile;