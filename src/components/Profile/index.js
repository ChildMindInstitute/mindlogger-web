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
    <div className="my-3 h-100">
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
        <div className="my-4">
          <a
            href="https://play.google.com/store/apps/details?id=lab.childmindinstitute.data&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          >
            <img
              className="linkAndroid"
              alt="Get it on Google Play"
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            />
          </a>

          <a href="https://testflight.apple.com/join/XbOijcEc">
            <img
              className="linkApple"
              alt="Get it on Apple Test Flight"
              src="https://miro.medium.com/max/512/0*Rb88ivTuqQAvWJEa.png"
            />
          </a>
        </div>
      }
    </div>
  )
}

export default Profile;